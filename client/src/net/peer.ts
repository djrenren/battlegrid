type Signal = any;

const PEER_CONFIG = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
type Message = string | Blob | ArrayBuffer | ArrayBufferView;

export class Peer {
  on_data: (channel: string, data: string) => void = () => {};

  /** Allows the Peer to communicate signals outwards */
  #on_signal: (signal: Signal) => void = () => {};

  /** The underlying peer connection, this may be close and replaced at any time */
  #rtc_peer: RTCPeerConnection = new RTCPeerConnection(PEER_CONFIG);

  /** The map of channels */
  #channels: Map<string, RTCDataChannel> = new Map();

  /** Tracks whether this peer was the initiator. Used during reconnect. */
  #initiator = false;

  /** Buffers messages for later delivery */
  #msg_buffer: Map<string, Message[]> = new Map();

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

  /** Ensures the underlying peer is in a clean state. This is a no-op if it already is */
  #cleanup_peer() {
    if (this.#rtc_peer.localDescription !== null) {
      this.#rtc_peer.onicecandidate = null;
      this.#rtc_peer.onconnectionstatechange = null;
      this.#rtc_peer.close();

      for (const [label, channel] of this.#channels.entries()) {
        if (channel) {
          channel.onopen = null;
          channel.onmessage = null;
          channel.onclose = null;
        }
        this.#channels.delete(label);
      }
    }
    this.#rtc_peer = new RTCPeerConnection(PEER_CONFIG);

    for (let [id, label] of ["control", "data"].entries()) {
      let channel = this.#rtc_peer.createDataChannel(label, {
        ordered: true,
        negotiated: true,
        id,
      }) as RTCDataChannel;

      channel.onmessage = ({ data }) => this.on_data(label, data);
      channel.onopen = () => {
        this.#msg_buffer.get(label)?.forEach((msg) => this.send(label, msg));
        this.#msg_buffer.set(label, []);
      };
      // We never expect a channel to close independently of the peer
      channel.onclose = (ev) => console.error(ev);

      this.#msg_buffer.set(label, []);
      this.#channels.set(label, channel);
    }

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

  send(label: string, msg: Message) {
    console.log("sending", msg);
    let channel = this.#channels.get(label)!;
    if (channel.readyState !== "open") {
      this.#msg_buffer.get(label)?.push(msg);
    } else {
      // Typescript won't unify our union with the overloads but the
      // Message type is correct so we just tell ts ot shut up.
      channel.send(msg as any);
    }
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
