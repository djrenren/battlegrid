import { stream, open as socket_open, with_heartbeat } from "../util/socket";
import { open as rtc_open } from "../util/rtc";
import { durable, iter, json } from "../util/streams";
import { Peer, PeerId } from "./peer";
import { StatusEmitter } from "../util/net";

const PEER_CONFIG = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const DEFAULT_SIGNALER = "ws://localhost:8081";
export type NewConnection = { id: PeerId; conn: RTCPeerConnection };

export class Signaler {
  incoming_peers: ReadableStream<Peer>;
  peer_id: PeerId;
  allow_connections = false;
  status = new StatusEmitter();

  #conns = new Map<PeerId, Peer>();
  #sigs: ReadableWritablePair<Signal, Signal>;
  #peer_writer: WritableStreamDefaultWriter<Peer>;
  #server: WritableStreamDefaultWriter<Signal>;
  #abort: AbortController;

  constructor(peer_id: PeerId, allow_connections = false) {
    this.allow_connections = allow_connections;
    this.#sigs = durable(async () => {
      console.log("INNER BUILDER");
      this.status.set('opening');
      
      console.log("HMMM");
      let url = new URL(DEFAULT_SIGNALER);
      url.pathname = peer_id;
      let s = json<Signal>(stream<string, string>(with_heartbeat(await socket_open(new WebSocket(url)))));
      this.status.set('open');
      return s;
    });
    this.peer_id = peer_id;
    const output = new TransformStream();
    this.incoming_peers = output.readable;
    this.#peer_writer = output.writable.getWriter();
    this.#server = this.#sigs.writable.getWriter();

    this.#abort = new AbortController();
    this.#loop();
  }

  initiate(remote_id: PeerId): Peer {
    
    let peer = this.#init_connection(remote_id);

    peer.rtc.createOffer().then(async offer =>{
      await peer.rtc.setLocalDescription(offer);
      console.log("WRITING");
      return this.#server.write({
        type: "offer",
        from: this.peer_id,
        to: remote_id,
        offer,
      });
    }).catch(e => console.error("Intiation error: ", e));


    // // There's no reliable close event for RTCPeerConnection
    // // if we manually close it, so instead we watch for the close event
    // // on the events channel
    // await Promise.race([
    //   waitFor("open", peer.events_dc),
    //   waitFor("close", peer.events_dc).then(() => {
    //     throw new Error("Unable to connect to host");
    //   }),
    // ]);

    console.log("Initiated peer");
    return peer;
  }

  #init_connection(remote_id: PeerId): Peer {
    let peer = new Peer(remote_id, new RTCPeerConnection(PEER_CONFIG));
    this.#conns.set(remote_id, peer);

    const onicecandidate = ({ candidate }: RTCPeerConnectionIceEvent) => {
      if (candidate !== null) {
        // Note: we don't await the write because there's no reason to block reads
        this.#server.write({
          type: "icecandidate",
          from: this.peer_id,
          to: remote_id,
          candidate,
        });
      }
    };

    // Forward all ice candidates
    peer.rtc.addEventListener("icecandidate", onicecandidate);

    const cleanup = async () => {
      peer.rtc.removeEventListener("icecandidate", onicecandidate);
      this.#conns.delete(remote_id);
    };

    peer.events_dc.addEventListener("close", cleanup);
    this.#abort.signal.addEventListener("abort", cleanup);

    peer.events_dc.addEventListener("open", async () => {
      await this.#peer_writer.write(peer);
    });

    return peer;
  }

  async #loop() {
    this.#sigs.readable
      .pipeTo(
        new WritableStream({
          write: async (sig) => {
            if (sig.type === "error-not-exists") {
              let peer = this.#conns.get(sig.destination);
              peer?.rtc.close();
              console.log("closing");
              return;
            }
            let remote = this.#conns.get(sig.from);
            switch (sig.type) {
              // A remote peer is trying to connect to us
              case "offer":
                if (!this.allow_connections) return;
                remote = this.#init_connection(sig.from);
                remote.rtc.setRemoteDescription(new RTCSessionDescription(sig.offer));
                let answer = await remote.rtc.createAnswer();
                await remote.rtc.setLocalDescription(answer);

                this.#server.write({
                  type: "answer",
                  from: this.peer_id,
                  to: sig.from,
                  answer,
                });

                break;

              case "answer":
                remote?.rtc.setRemoteDescription(new RTCSessionDescription(sig.answer));
                break;

              case "icecandidate":
                await remote?.rtc.addIceCandidate(sig.candidate);
                break;
            }
          },
        }),
        { signal: this.#abort.signal }
      )
      .catch((e) => {
        // Aborting throws and the logs are already messy enough
      });
  }

  async shutdown() {
    try {
      this.#abort.abort("shutting down signaler");
      this.status.set('closed');
    } catch {}
    try {
      console.log("closing server...");
      this.#server.abort("Client shutting down");
      console.log("closing server...");
    } catch {}
  }
}

type SignalData = { from: PeerId; to: PeerId } & (
  | {
      type: "answer";
      answer: RTCSessionDescriptionInit;
    }
  | {
      type: "offer";
      offer: RTCSessionDescriptionInit;
    }
  | {
      type: "icecandidate";
      candidate: RTCIceCandidate;
    }
);

type SignalError = {
  type: "error-not-exists";
  destination: PeerId;
};

type Signal = SignalData | SignalError;

export type SignalingStatus = "connected" | "disconnected" | "closed";
