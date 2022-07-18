import { Game } from "../game/game";
import { GameEvent } from "../game/game-events";
import { consume } from "../util/streams";
import { Signaler, PeerId } from "./rtc/signaler";
import { RESOURCE_PROTOCOL, request } from "./resources/protocol";
import { dc_status, MAX_MESSAGE_SIZE, streams } from "../util/rtc";
import { ResourceId, ResourceMessage, ResourceRequest } from "./resources/service-worker-protocol";
import { StatusEmitter } from "../util/net";
import { GamePeer } from "./game_peer";
import { applyUpdate, logUpdate } from "yjs";

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
    this.#game.doc.on("update", this.forward_updates);
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

  forward_updates = (update: Uint8Array, origin: any) => {
    if (origin === "remote") return;
    this.#peer.write_event(update);
  };

  async reconnect(): Promise<void> {
    this.#peer = this.#setup_peer();
  }

  async shutdown() {
    this.#game.doc.off("update", this.forward_updates);
    this.#peer.peer.close();
    console.log("Waiting for signaler shutdown");
    await this.#signaler.shutdown();
    console.log("signaler dead");
    navigator.serviceWorker.onmessage = null;
  }

  #setup_peer(): GamePeer {
    let peer = new GamePeer(this.#signaler.peer_id, this.#signaler.initiate(this.#game_id));

    consume(peer.events, (ev) => {
      return applyUpdate(this.#game.doc, ev, "remote");
    });

    return peer;
  }
}
