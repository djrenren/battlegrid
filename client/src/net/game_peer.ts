import { GameEvent } from "../game/game-events";
import { StatusEmitter } from "../util/net";
import { streams } from "../util/rtc";
import { json } from "../util/streams";
import { request, Resource, RESOURCE_PROTOCOL } from "./resources/protocol";
import { ResourceId } from "./resources/service-worker-protocol";
import { PeerId } from "./rtc/signaler";

export type GameUpdate = Uint8Array;

export class GamePeer {
    peer: RTCPeerConnection;
    status = new StatusEmitter();
    id: PeerId;

    events: ReadableStream<GameUpdate>;
    #event_writer: WritableStreamDefaultWriter<GameUpdate>;

    constructor(id: PeerId, peer: RTCPeerConnection) {
        this.id = id;
        this.peer = peer;

        let dc = peer.createDataChannel("events", {negotiated: true, id: 1});
        dc.binaryType = "arraybuffer"; 
        let {readable, writable} = streams<ArrayBuffer, ArrayBuffer>(dc);

        this.events = readable.pipeThrough(new TransformStream<ArrayBuffer, Uint8Array>({
            transform(chunk, controller) {
                console.log('chunk', chunk);
                controller.enqueue(new Uint8Array(chunk))
            }
        }));
        this.#event_writer = writable.getWriter();

        // This is gross but the manual close from the signaler won't fire any handlers
        let old_close = peer.close;
        peer.close = () => {this.status.set('closed'); old_close.bind(peer)()}

        peer.addEventListener('iceconnectionstatechange', () => {
            console.log("STATE CHANGE");
            switch (peer.iceConnectionState) {
                case "closed":
                    this.status.set('closed');
                    break;
                case 'connected':
                    this.status.set('open');
                    break;
                default:
                    this.status.set('opening');
                    break;

            }
        });

        peer.ondatachannel = (ev) => this.ondatachannel(ev);
    }

    write_event(ev: GameUpdate) {
        return this.#event_writer.write(ev);
    }

    request(id: ResourceId): Promise<Resource> {
      return this.datachannel(id, {protocol: RESOURCE_PROTOCOL})
        .then(streams<ArrayBuffer, ArrayBuffer>)
        .then(request)
    }


    ondatachannel = (ev: RTCDataChannelEvent) => {};

    datachannel(name: string, init?: RTCDataChannelInit): Promise<RTCDataChannel> {
        return new Promise((resolve, reject) => {
        let dc = this.peer.createDataChannel(name, init);
        dc.addEventListener(
            "open",
            () => {
            dc.removeEventListener("error", reject);
            resolve(dc);
            },
            { once: true }
        );
        dc.addEventListener("error", reject, { once: true });
        });
    }
}