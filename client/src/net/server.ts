import { Game } from "../game/game";
import { serialize_tbt } from "../game/tabletop";
import { waitFor } from "../util/events";
import { streams } from "../util/rtc";
import { consume } from "../util/streams";
import { Peer } from "./peer";
import { Resource, RESOURCE_PROTOCOL, response } from "./resources/protocol";
import { ResourceId } from "./resources/service-worker-protocol";
import { Signaler } from "./signaling";

export class Server {
  signaler: Signaler;
  #game: Game;
  #clients: Set<Peer> = new Set();

  constructor(signaler: Signaler, game: Game) {
    this.signaler = signaler;
    this.#game = game;

    consume(this.signaler.incoming_peers, async (peer) => this.#add_client(peer));

    this.#game.addEventListener("game-event", ({ detail: ev }) => {
      for (let client of this.#clients) {
        if (client.id === ev.remote) continue;
        client.write_event(ev);
      }
    });
  }

  static async establish(game: Game): Promise<Server> {
    return new Server(await Signaler.establish(), game);
  }

  #add_client(peer: Peer) {
    this.#clients.add(peer);

    // It's a little weird that we're sending the JSON encoding
    // as a string. But we need to capture the state of the tabletop
    // at this exact moment. If we didn't JSON encode now, the tabletop
    // could be mutated before being written to the wire.
    //
    // We aim for idempotency so this *shouldn't* be a problem, but lets
    // just avoid it
    peer.write_event({
      type: "state-sync",
      tabletop: serialize_tbt(this.#game.tabletop),
    });

    consume(peer.events, (ev) => {
      ev.remote = peer.id;
      return this.#game.apply(ev);
    });

    peer.events_dc.addEventListener("close", () => {
      console.log("PEEER EVENT DC");
      this.#clients.delete(peer);
    });

    peer.ondatachannel = async (ev) => {
      console.log("INCOMING DC", ev.channel);
      const channel = ev.channel;
      await waitFor("open", channel);
      console.log("new dc", channel);
      if (channel.protocol === RESOURCE_PROTOCOL) {
        response(streams<ArrayBuffer, ArrayBuffer>(channel), await this.#get_resource(channel.label as ResourceId));
      }
    };
  }

  async #get_resource(id: ResourceId): Promise<Resource> {
    let resp = await fetch(`/resources/${id}`);
    return { blob: await resp.blob() };
  }

  shutdown() {
    for (let c of this.#clients) {
      c.rtc.close();
    }

    this.#clients.clear();
  }
}
