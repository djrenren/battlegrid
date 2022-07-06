import { waitFor } from "../util/events";
import { stream, open as socket_open } from "../util/socket";
import { open as rtc_open } from "../util/rtc";
import { durable, iter, json } from "../util/streams";
import { Peer, PeerId } from "./peer";

const PEER_CONFIG = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const DEFAULT_SIGNALER = new URL("wss://battlegrid-signaling.herokuapp.com");
export type NewConnection = { id: PeerId; conn: RTCPeerConnection };

export class Signaler {
  incoming_peers: ReadableStream<Peer>;
  peer_id: PeerId;

  #conns = new Map<PeerId, Peer>();
  #sigs: ReadableWritablePair<Signal, Signal>;
  #peer_writer: WritableStreamDefaultWriter<Peer>;
  #server: WritableStreamDefaultWriter<Signal>;
  #abort: AbortController;

  private constructor(sigs: ReadableWritablePair<Signal, Signal>, peer_id: PeerId) {
    this.#sigs = sigs;
    this.peer_id = peer_id;
    const output = new TransformStream();
    this.incoming_peers = output.readable;
    this.#peer_writer = output.writable.getWriter();
    this.#server = this.#sigs.writable.getWriter();

    this.#abort = new AbortController();
    this.#loop();
  }

  static async establish(signaling_server: URL = DEFAULT_SIGNALER, peer_id = crypto.randomUUID() as PeerId) {
    signaling_server.pathname = peer_id;
    // Set up our durable stream of signaling events
    let sigs = await durable(async () => json<Signal>(stream<string, string>(await socket_open(new WebSocket(signaling_server)))));

    return new Signaler(sigs, peer_id);
  }

  async initiate(remote_id: PeerId): Promise<Peer> {
    let peer = this.#init_connection(remote_id);
    let offer = await peer.rtc.createOffer();
    await peer.rtc.setLocalDescription(offer);

    this.#server.write({
      type: "offer",
      from: this.peer_id,
      to: remote_id,
      offer,
    });

    // There's no reliable close event for RTCPeerConnection
    // if we manually close it, so instead we watch for the close event
    // on the events channel
    await Promise.race([
      waitFor("open", peer.events_dc),
      waitFor("close", peer.events_dc).then(() => {
        throw new Error("Unable to connect to host");
      }),
    ]);

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
            console.log(sig);
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
    } catch {}
    await this.#server.close();
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

export type Status = "connected" | "disconnected" | "closed";
export type StatusEvent = CustomEvent<Status>;
