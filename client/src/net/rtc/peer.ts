type Signal = any;

const PEER_CONFIG = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

export class Peer {
  /** Allows the Peer to communicate signals outwards */
  #on_signal: (signal: Signal) => void = () => {};

  /** The underlying peer connection, this may be close and replaced at any time */
  #rtc_peer: RTCPeerConnection = new RTCPeerConnection(PEER_CONFIG);

  /** Tracks whether this peer was the initiator. Used during reconnect. */
  #initiator = false;

  //@ts-ignore
  data: RTCDataChannel;

  //@ts-ignore
  events: RTCDataChannel;

  constructor(on_signal: (signal: Signal) => void) {
    this.#on_signal = on_signal;
    this.#cleanup_peer();
  }

  /** Initiates a connection with the remote peer. Used for both initial connects and reconnects after hard drops */
  async initiate() {
    this.#initiator = true;

    let offer = await this.#rtc_peer.createOffer();
    await this.#rtc_peer.setLocalDescription(offer);

    this.#on_signal({
      type: "offer",
      offer,
    });
  }

  close () {
    if (this.#rtc_peer.localDescription !== null) {
      this.#rtc_peer.onicecandidate = null;
      this.#rtc_peer.onconnectionstatechange = null;
      this.#rtc_peer.close();
    }
  }

  /** Ensures the underlying peer is in a clean state. This is a no-op if it already is */
  #cleanup_peer() {
    if (this.#rtc_peer.localDescription !== null) {
      this.#rtc_peer.onicecandidate = null;
      this.#rtc_peer.onconnectionstatechange = null;
      this.#rtc_peer.close();
    }
    this.#rtc_peer = new RTCPeerConnection(PEER_CONFIG);

    this.data = this.#rtc_peer.createDataChannel("data", {
      ordered: true,
      negotiated: true,
      id: 1,
    });

    this.events = this.#rtc_peer.createDataChannel("control", {
      ordered: true,
      negotiated: true,
      id: 2,
    });

    this.#rtc_peer.onicecandidate = ({ candidate }) => {
      if (candidate !== null) {
        this.#on_signal({
          type: "icecandidate",
          candidate,
        });
      }
    };

    this.#rtc_peer.onconnectionstatechange = () => {
      if (this.#rtc_peer.connectionState === "closed") {
        this.#cleanup_peer();

        if (this.#initiator) {
          this.initiate();
        }
      }
    };
  }

  /** Handles incoming signals */
  async signal(s: Signal) {
    console.log("received", s);
    let ss = this.#rtc_peer.signalingState;

    switch (s.type) {
      case "offer":
        if (ss !== "stable") {
          console.error(`Received offer at incorrect state: ${ss}. Ignoring.`);
          return;
        }

        this.#rtc_peer.setRemoteDescription(new RTCSessionDescription(s.offer));
        const answer = await this.#rtc_peer.createAnswer();
        await this.#rtc_peer.setLocalDescription(answer);

        this.#on_signal({
          type: "answer",
          answer,
        });

        break;

      case "answer":
        if (ss !== "have-local-offer") {
          console.error(`Received answer at incorrect state: ${ss}. Ignoring.`);
          return;
        }
        this.#rtc_peer.setRemoteDescription(new RTCSessionDescription(s.answer));
        break;

      case "icecandidate":
        await this.#rtc_peer.addIceCandidate(s.candidate);
        break;
    }
  }
}
