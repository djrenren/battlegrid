import { waitFor } from "../util/events";
import { flush, MAX_MESSAGE_SIZE, streams } from "../util/rtc";
import { consume } from "../util/streams";
import { GamePeer } from "./game_peer";
import { Resource, RESOURCE_PROTOCOL, response } from "./resources/protocol";
import { ResourceId } from "./resources/service-worker-protocol";
import { Signaler, PeerId } from "./rtc/signaler";
import { applyUpdate, encodeStateAsUpdate, encodeStateVector, logUpdate } from "yjs";
import { Game } from "../game/game";

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
    this.#game.doc.on("update", (update, origin) => {
      // todo, prevent echo
      for (let client of this.clients) {
        console.log("ECHO", client.id, origin);
        if (client.id === origin) continue;
        client.write_event(update);
      }
    });
  }

  #add_client = (id: PeerId, peer: RTCPeerConnection) => {
    let gp = new GamePeer(id, peer);
    this.clients.add(gp);

    gp.write_event(encodeStateAsUpdate(this.#game.doc));

    consume(gp.events, (ev) => {
      applyUpdate(this.#game.doc, ev, id);
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
