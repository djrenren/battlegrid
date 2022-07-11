import { EventEmitter } from "../util/events";
import { StatusEmitter } from "../util/net";
import { with_heartbeat } from "../util/socket";
import { Peer, PeerId } from "./peer";

const DEFAULT_SIGNALER = "ws://localhost:8081";
const PEER_CONFIG = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
const RECONNECT_TIMEOUT = 1000; //ms

export class Signaler extends EventTarget implements EventEmitter<{ peer: CustomEvent<Peer> }> {
  status = new StatusEmitter();
  peer_id: PeerId;

  #socket: WebSocket;
  #signal_url: string;
  #allow_connections: boolean;
  #conns = new Map<PeerId, Peer>();
  #shutting_down = false;

  constructor(peer_id: PeerId, allow_connections = false, signal_url = DEFAULT_SIGNALER) {
    super();
    this.peer_id = peer_id;
    this.#allow_connections = allow_connections;
    this.#signal_url = signal_url;
    this.#socket = this.#establish_socket();
  }

  initiate(remote_id: PeerId): Peer {
    let peer = this.#init_connection(remote_id);

    peer.rtc
      .createOffer()
      .then(async (offer) => {
        await peer.rtc.setLocalDescription(offer);
        return this.#send({
          type: "offer",
          from: this.peer_id,
          to: remote_id,
          offer,
        });
      })
      .catch((e) => console.error("Intiation error: ", e));

    return peer;
  }

  #establish_socket(): WebSocket {
    this.status.set("opening");
    let url = new URL(this.#signal_url);
    url.pathname = this.peer_id;
    this.#socket = with_heartbeat(new WebSocket(url));
    this.#socket.addEventListener("open", () => this.status.set("open"), { once: true });
    this.#socket.addEventListener("close", this.#socket_shutdown);
    this.#socket.addEventListener("hard-disconnect", this.#socket_shutdown);
    this.#socket.addEventListener("message", this.#handle_message);
    return this.#socket;
  }

  #socket_shutdown = () => {
    this.status.set("opening");
    this.#socket.removeEventListener("close", this.#socket_shutdown);
    this.#socket.removeEventListener("hard-disconnect", this.#socket_shutdown);
    this.#socket.removeEventListener("message", this.#handle_message);

    !this.#shutting_down && this.#reconnect();
  };

  async #send(msg: Signal) {
    await this.status.connected();
    this.#socket.send(JSON.stringify(msg));
  }

  #init_connection(remote_id: PeerId): Peer {
    let peer = new Peer(remote_id, new RTCPeerConnection(PEER_CONFIG));
    this.#conns.set(remote_id, peer);

    const onicecandidate = ({ candidate }: RTCPeerConnectionIceEvent) => {
      if (candidate !== null) {
        this.#send({
          type: "icecandidate",
          from: this.peer_id,
          to: remote_id,
          candidate,
        });
      }
    };

    // Forward all ice candidates
    peer.rtc.addEventListener("icecandidate", onicecandidate);

    peer.events_dc.addEventListener("close", () => {
      peer.rtc.removeEventListener("icecandidate", onicecandidate);
      this.#conns.delete(remote_id);
    });

    peer.events_dc.addEventListener("open", async () => {
      this.dispatchEvent(new CustomEvent("peer", { detail: peer }));
    });

    return peer;
  }

  #handle_message = async ({ data }: MessageEvent<string>) => {
    let sig = JSON.parse(data);

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
        if (!this.#allow_connections) return;
        remote = this.#init_connection(sig.from);
        remote.rtc.setRemoteDescription(new RTCSessionDescription(sig.offer));
        let answer = await remote.rtc.createAnswer();
        await remote.rtc.setLocalDescription(answer);

        this.#socket.send(
          JSON.stringify({
            type: "answer",
            from: this.peer_id,
            to: sig.from,
            answer,
          })
        );

        break;

      case "answer":
        remote?.rtc.setRemoteDescription(new RTCSessionDescription(sig.answer));
        break;

      case "icecandidate":
        await remote?.rtc.addIceCandidate(sig.candidate);
        break;
    }
  };

  #reconnect() {
    setTimeout(() => this.#establish_socket(), RECONNECT_TIMEOUT);
  }

  shutdown() {
    this.#shutting_down = true;
    this.#socket.close();
    this.#conns.clear();
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
