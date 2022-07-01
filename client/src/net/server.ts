import { GameEvent, StateSync } from "../game/game-events";
import { DurableSignaler } from "./signaling";
import { type Status, type Client, RichClient } from "./client";
import { streams } from "./rtc/rtc-data-stream";
import { Game } from "../game/game";
import { resources } from "./rtc/rtc-resource-encoder";

export class Server {
  signaler: DurableSignaler;
  local_client: RichClient;
  #clients: Set<RichClient> = new Set();
  #game: Game;

  private constructor(signaler: DurableSignaler, game: Game) {
    this.#game = game;
    this.signaler = signaler;
    let [client_side, server_side] = two_way_client();

    this.local_client = client_side;
    this.#add_client(server_side);
    this.signaler.addEventListener("peer", async ({ detail: peer }) => {
      let events = resources(streams(peer.events));
      let data = resources(streams(peer.data));

      let remote_client = new RichClient({
        status: 'connected',
        events,
        data,
        close: () => peer.close()
      });

      this.#add_client(remote_client);
    });
  }

  #add_client(client: RichClient) {
    console.log("added client", client);
    this.#clients.add(client);

    client.on_event = async (ev) => {
      await Promise.all(
        Array.from(this.#clients)
            .filter((w) => w !== client)
            .map((w) => w.send(ev))
      )
    };

    client.send(this.get_state!());

    client.handle('get_image', ({id}) => {
      return {
        data: new Blob()
      }
    })
  }


  static async establish(game: Game): Promise<Server> {
    return new Server(await DurableSignaler.establish(new URL("wss://battlegrid-signaling.herokuapp.com/")), game);
  }

  on_event: (ev: any) => any = () => {};
  get_state(): StateSync {
    return this.#game.get_state();
  };
  get_images?: () => IterableIterator<[string, string]>;
}


const two_way_client = (): [RichClient, RichClient] => {
    let client_events = new TransformStream();
    let client_data = new TransformStream();
    let server_events = new TransformStream();
    let server_data = new TransformStream();

    return [new RichClient({
      status: 'connected',
      events: {
        readable: server_events.readable,
        writable: client_events.writable
      },
      data: {
        readable: server_data.readable,
        writable: client_data.writable
      },
      close() {}
    }),

    new RichClient({
      status: 'connected',
      events: {
        readable: client_events.readable,
        writable: server_events.writable,
      },
      data: {
        readable: client_data.readable,
        writable: server_data.writable,
      },
      close() {}
    })]
}