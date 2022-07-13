import { Game } from "../game/game";
import { GameEvent } from "../game/game-events";
import { consume } from "../util/streams";
import { Peer, PeerId } from "./peer";
import { Signaler } from "./signaler";
import { RESOURCE_PROTOCOL, request } from "./resources/protocol";
import { dc_status, MAX_MESSAGE_SIZE, streams } from "../util/rtc";
import { ResourceId, ResourceMessage, ResourceRequest } from "./resources/service-worker-protocol";
import { StatusEmitter } from "../util/net";
import { preProcessFile } from "typescript";

export class Client {
  #game: Game;
  #peer: Peer;
  #game_id: PeerId
  #signaler: Signaler;
  status = new StatusEmitter();

  constructor(game_id: PeerId, game: Game) {
    this.#signaler = new Signaler(crypto.randomUUID() as PeerId);
    this.#game = game;
    this.#game_id = game_id;
    this.#game.addEventListener('game-event', this.forward_events);
    this.#peer = this.#setup_peer();
    let cache = caches.open('resources');
    navigator.serviceWorker.onmessage = async (ev: MessageEvent<ResourceRequest>) => {
      let id = ev.data.id as ResourceId;
      console.log("CLIENT ATTEMPTING TO FETCH", this.#peer.events_dc.readyState);
      await this.#peer.datachannel(id, {protocol: RESOURCE_PROTOCOL})
        .then((dc) => {dc.bufferedAmountLowThreshold = 0; return dc})
        .then(streams<ArrayBuffer, ArrayBuffer>)
        .then(request)
        .then(async ({blob}) => {
          console.log("COMMUNICATING WITH SERVICE WORKER");
          let r = new Response(blob);
          await (await cache).put(`/resources/${id}`, r);
          navigator.serviceWorker.controller!.postMessage({type: 'found', id} as ResourceMessage)
        })
        .catch(e => {
          console.error("Error fetching resource: ", e);
          navigator.serviceWorker.controller!.postMessage({type: 'notfound', id, error: e} as ResourceMessage)
        })
    }

  }

  forward_events = ({detail: ev}: CustomEvent<GameEvent>) => {
    console.log("CALLBACK", ev);
    if (ev.remote) return;
    this.#peer.write_event(ev);
  }


  async reconnect(): Promise<void> {
    this.#peer = this.#setup_peer();
  }

  async shutdown() {
    this.#game.removeEventListener('game-event', this.forward_events as any);
    this.#peer.rtc.close();
    console.log("Waiting for signaler shutdown");
    await this.#signaler.shutdown();
    console.log("signaler dead");
    navigator.serviceWorker.onmessage = null;
  }

  #setup_peer(): Peer {
    let peer = this.#signaler.initiate(this.#game_id);
    peer.rtc.addEventListener('iceconnectionstatechange', () => {
      console.log("CONN STATE CHANGED");
      if (peer.rtc.iceConnectionState === "connected") {
        this.status.set('open');
      }
    })
    peer.events_dc.addEventListener('close', () => this.status.set('closed'));
    peer.events_dc.addEventListener('open', () => this.status.set('open'));
    this.status.set(dc_status(peer.events_dc));

    consume(peer.events, (ev) => {
      return this.#game.apply(ev)
    });

    return peer;
  }
}
