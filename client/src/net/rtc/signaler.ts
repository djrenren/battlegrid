import { WebsocketClient } from "lib0/websocket";
import { Observable } from "lib0/observable";
import { Peer } from "./peer";
import { StatusEmitter } from "../../util/net";
const DEFAULT_SIGNALER = "wss://battlegrid-signaling.herokuapp.com";

const PEER_CONFIG = {
  iceServers: [{ urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] }],
};

type PeerState = {
  polite: boolean;
  making_offer: boolean;
  ignore_offer: boolean;
  isSettingRemoteAnswerPending: boolean;
  peer: RTCPeerConnection;
}

export type PeerId = string & { __brand: "PeerId" };
export class Signaler extends Observable<'peer'> {
  socket: WebsocketClient;
  peers: Map<PeerId, PeerState> = new Map();
  peer_id: PeerId;
  status = new StatusEmitter();
  allow_connections: boolean;

  constructor(peer_id: PeerId, allow_connections = false, signal_url = DEFAULT_SIGNALER) {
    super();

    let url = new URL(signal_url);
    url.pathname = peer_id;

    this.allow_connections = allow_connections;
    this.peer_id = peer_id;
    this.socket = new WebsocketClient(url.toString());
    this.status.set('opening');
    this.socket.on('connect', () => this.status.set('open'));
    this.socket.on('disconnect', () => this.status.set('opening'));
    this.socket.on("message", this.#onmessage);
  }

  initiate(remote_id: PeerId): RTCPeerConnection {
    return this.#init_connection(remote_id, false).peer;
  }

  #init_connection(remote_id: PeerId, outgoing: boolean): PeerState {
    let peer = new RTCPeerConnection(PEER_CONFIG);
    let state = {
      polite: outgoing,
      making_offer: false,
      ignore_offer: false,
      isSettingRemoteAnswerPending: false,
      peer
    };

    this.peers.set(remote_id, state);

    // Forward all ice candidates
    peer.onicecandidate = async ({candidate}) => {
        await this.#send({
          type: "signal",
          from: this.peer_id,
          to: remote_id,
          candidate,
        });
    }

    peer.onnegotiationneeded = async () => {
      console.log('negotiation needed!')
      try {
      state.making_offer = true;
      await peer.setLocalDescription();
      await this.#send({type: 'signal', from: this.peer_id, to: remote_id, description: peer.localDescription});
      } finally {
        state.making_offer = false;
      }
    }

    peer.addEventListener('iceconnectionstatechange', () => {
      console.log("iceConnectionState", peer.iceConnectionState);
      if (peer.iceConnectionState === "closed") {
        this.peers.delete(remote_id);
      }
    });

    return state;
  }

  async #send(msg: Signal) {
    await this.status.connected();
    await this.socket.send(msg);
  }

  #onmessage = async (sig: Signal) => {
    console.log("ONMESSAGE", sig);
    if (sig.type === "error-not-exists") {
      let state = this.peers.get(sig.destination);
      state?.peer.close();
      console.log("closing");
      return;
    }

    let state = this.peers.get(sig.from);
    if (!state) {
      if (sig.description?.type === "offer") {
        state = this.#init_connection(sig.from, false);
      } else {
        return;
      }
    }

    let pc = state.peer;

    // Adapted from "Perfect Negotiation" by Mozilla: (https://blog.mozilla.org/webrtc/perfect-negotiation-in-webrtc/)
    if (sig.description) {
      // An offer may come in while we are busy processing SRD(answer).
      // In this case, we will be in "stable" by the time the offer is processed // so it is safe to chain it on our Operations Chain now.
      const readyForOffer =
          !state.making_offer &&
          (pc.signalingState == "stable" || state.isSettingRemoteAnswerPending);
      const offerCollision = sig.description.type == "offer" && !readyForOffer;
      state.ignore_offer = !state.polite && offerCollision;

      if (state.ignore_offer) {
        return;
      }

      state.isSettingRemoteAnswerPending = sig.description.type === "answer";
      await pc.setRemoteDescription(sig.description);
      state.isSettingRemoteAnswerPending = false;

      if(sig.description.type === "offer") {
        await pc.setLocalDescription();
        await this.#send({ type: 'signal', from: this.peer_id, to: sig.from, description: pc.localDescription });
      }
      this.emit('peer', [sig.from, pc]);
    } else if (sig.candidate) {
      try {
        await pc.addIceCandidate(sig.candidate);
      } catch (err) {
        if (!state.ignore_offer) throw err;
      }
    }
  };

  shutdown() {
    this.socket.destroy();
    this.peers.clear();
  }
}

type SignalData = { type: "signal"; from: PeerId; to: PeerId } & {
  description?: RTCSessionDescription | null;
  candidate?: RTCIceCandidate | null;
};

type SignalError = {
  type: "error-not-exists";
  destination: PeerId;
};

type Signal = SignalData | SignalError;
