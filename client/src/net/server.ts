import { createImportSpecifier } from "typescript";
import { Game } from "../game/game";
import { serialize_tbt } from "../game/tabletop";
import { waitFor } from "../util/events";
import { flush, MAX_MESSAGE_SIZE, streams } from "../util/rtc";
import { consume } from "../util/streams";
import { GamePeer } from "./game_peer";
import { Resource, RESOURCE_PROTOCOL, response } from "./resources/protocol";
import { ResourceId } from "./resources/service-worker-protocol";
import { Signaler, PeerId } from "./rtc/signaler";

export class Server {
  signaler: Signaler;
  #game: Game;
  clients: Set<GamePeer> = new Set();
  #abort: AbortController;

  constructor(game: Game) {
    this.signaler = new Signaler(crypto.randomUUID() as PeerId, true);
    this.#game = game;
    this.#abort = new AbortController();
    this.signaler.on("peer", this.#add_client);
    this.#game.addEventListener("game-event", ({ detail: ev }) => {
      ev.remote ??= this.signaler.peer_id;
      for (let client of this.clients) {
        console.log("ECHOING", client.id, ev.remote);
        if (client.id === ev.remote) continue;
        client.write_event(ev);
      }
    });
  }

  #add_client = (id: PeerId, peer: RTCPeerConnection) => {
    let gp = new GamePeer(id, peer);
    this.clients.add(gp);

    // It's a little weird that we're sending the JSON encoding
    // as a string. But we need to capture the state of the tabletop
    // at this exact moment. If we didn't JSON encode now, the tabletop
    // could be mutated before being written to the wire.
    //
    // We aim for idempotency so this *shouldn't* be a problem, but lets
    // just avoid it
    gp.write_event({
      type: "state-sync",
      tabletop: serialize_tbt(this.#game.tabletop),
      remote: this.signaler.peer_id,
    });

    consume(gp.events, (ev) => {
      console.log("RECEIVED EVENT FROM ");
      ev.remote = id;
      return this.#game.apply(ev);
    });

    // peer.events_dc.addEventListener("close", () => {
    //   console.log("PEEER EVENT DC");
    //   this.clients.delete(peer);
    // });

    peer.ondatachannel = async (ev) => {
      console.log("INCOMING DC", ev.channel);
      const channel = ev.channel;
      try {
        await waitFor("open", channel);
        console.log("new dc", channel);
        if (channel.protocol === RESOURCE_PROTOCOL) {
          await response(
            streams<ArrayBuffer, ArrayBuffer>(channel),
            await this.#get_resource(channel.label as ResourceId),
            peer.sctp?.maxMessageSize || MAX_MESSAGE_SIZE
          );
          console.log("FLUSHING");
          await flush(channel);
        }
      } finally {
        channel.close();
      }
    };
  };

  async #get_resource(id: ResourceId): Promise<Resource> {
    let resp = await (await caches.open("resources")).match(`/resources/${id}`);
    if (!resp) {
      throw `Requested unknown resource ${id}`;
    }
    return { blob: await resp.blob() };
  }

  async shutdown() {
    for (let c of this.clients) {
      c.peer.close();
    }

    this.clients.clear();
    this.#abort.abort("Server shutting down");
    await this.signaler.shutdown();
  }
}
