import { Game } from "../game/game";
import { GameEvent } from "../game/game-events";
import { consume, iter, pipe } from "../util/streams";
import { Peer, PeerId } from "./peer";
import { Signaler } from "./signaling";
import { RESOURCE_PROTOCOL, request } from "./resources/protocol";
import { streams } from "../util/rtc";
import { ResourceId, ResourceMessage, ResourceRequest } from "./resources/service-worker-protocol";

export class Client extends EventTarget {
  #game: Game;
  #peer: Peer;
  #game_id: PeerId

  get status() {
    // TODO: Implement statuses
    return this.#peer.rtc.iceConnectionState;
  }

  private constructor(game_id: PeerId, game: Game, peer: Peer) {
    super();
    this.#game = game;
    this.#peer = peer;
    this.#game_id = game_id;
    this.#configure_peer();

    navigator.serviceWorker.onmessage = async (ev: MessageEvent<ResourceRequest>) => {
      let id = ev.data.id as ResourceId;
      console.log("CLIENT ATTEMPTING TO FETCH", this.#peer.events_dc.readyState);
      await this.#peer.datachannel(id, {protocol: RESOURCE_PROTOCOL})
        .then(streams<ArrayBuffer, ArrayBuffer>)
        .then(request)
        .then(async ({blob}) => {
          console.log("COMMUNICATING WITH SERVICE WORKER");
          navigator.serviceWorker.controller!.postMessage({type: 'found', id, blob} as ResourceMessage)
        })
        .catch(e => {
          console.error("Error fetching resource: ", e);
          navigator.serviceWorker.controller!.postMessage({type: 'notfound', id, error: e} as ResourceMessage)
        })
    }

  }

  async reconnect() {
    this.#peer = await Client.#get_peer(this.#game_id);
    this.#configure_peer();
  }

  #configure_peer() {
    console.log("configuring peer", this.#peer.events_dc.readyState);
    consume(this.#peer.events, (ev) => {
      return this.#game.apply(ev)
    });

    let forward_events = ({detail: ev}: CustomEvent<GameEvent>) => {
      console.log("CALLBACK", ev);
      if (ev.remote) return;
      this.#peer.write_event(ev);
    }

    this.#game.addEventListener('game-event', forward_events);

    this.#peer.events_dc.addEventListener('close', () => {
      this.#game.removeEventListener('game-event', forward_events as any);
    });
  }

  static async establish(game_id: PeerId, game: Game) {
    console.log("ESTABLISHING CLIENT");
    return new Client(game_id, game, await this.#get_peer(game_id));
  }

  static async #get_peer(game_id: PeerId) {
    let signaler = await Signaler.establish();
    let peer = await signaler.initiate(game_id);
    signaler.shutdown();
    return peer;
  }

  shutdown() {
    this.#peer.rtc.close();
    navigator.serviceWorker.onmessage = null;
  }
}
