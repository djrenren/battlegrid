import { Game } from "../game/game";
import { GameEvent } from "../game/game-events";
import { consume } from "../util/streams";
import { Signaler, PeerId } from "./rtc/signaler";
import { RESOURCE_PROTOCOL, request } from "./resources/protocol";
import { dc_status, MAX_MESSAGE_SIZE, streams } from "../util/rtc";
import { ResourceId, ResourceMessage, ResourceRequest } from "./resources/service-worker-protocol";
import { StatusEmitter } from "../util/net";
import { GamePeer } from "./game_peer";

export class Client {
  #game: Game;
  #peer: GamePeer;
  #game_id: PeerId;
  #signaler: Signaler;
  get status(): StatusEmitter {
    return this.#peer.status;
  }

  constructor(game_id: PeerId, game: Game) {
    this.#signaler = new Signaler(crypto.randomUUID() as PeerId);
    this.#game = game;
    this.#game_id = game_id;
    this.#game.addEventListener("game-event", this.forward_events);
    this.#peer = this.#setup_peer();
    let cache = caches.open("resources");
    navigator.serviceWorker.onmessage = async (ev: MessageEvent<ResourceRequest>) => {
      let id = ev.data.id as ResourceId;
      try {
        let resource = await this.#peer.request(id);
        let r = new Response(resource.blob);
        await (await cache).put(`/resources/${id}`, r);
        console.log("COMMUNICATING WITH SERVICE WORKER");
        navigator.serviceWorker.controller!.postMessage({ type: "found", id } as ResourceMessage);
      } catch (e) {
        console.error("Error fetching resource: ", e);
        navigator.serviceWorker.controller!.postMessage({ type: "notfound", id, error: e } as ResourceMessage);
      }
    };
  }

  forward_events = ({ detail: ev }: CustomEvent<GameEvent>) => {
    console.log("CALLBACK", ev);
    if (ev.remote) return;
    ev.remote = this.#peer.id;
    this.#peer.write_event(ev);
  };

  async reconnect(): Promise<void> {
    this.#peer = this.#setup_peer();
  }

  async shutdown() {
    this.#game.removeEventListener("game-event", this.forward_events as any);
    this.#peer.peer.close();
    console.log("Waiting for signaler shutdown");
    await this.#signaler.shutdown();
    console.log("signaler dead");
    navigator.serviceWorker.onmessage = null;
  }

  #setup_peer(): GamePeer {
    let peer = new GamePeer(this.#signaler.peer_id, this.#signaler.initiate(this.#game_id));

    consume(peer.events, (ev) => {
      return this.#game.apply(ev);
    });

    return peer;
  }
}
