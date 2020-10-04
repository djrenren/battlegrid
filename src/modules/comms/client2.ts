import { DataConnection } from "peerjs";
import { connect_peer, create_peer, PeerID } from "./peer";
import { ServerClient } from "./server";

export type ClientConfig = {
  onDisconnect(): void;
  onMessage(msg: any): void;
  onInitialMessage(msg: any): void;
  onConnect(): void;
};

export async function game_client(
  game: string,
  client_id: string,
  handlers: ClientConfig
): Promise<ServerClient> {
  // NOTE: the client_id is not used to construct the peer_id. clients do not need stable Peer identifiers
  //       instead, clients are identified using the meta field on the Peer
  let peer = await create_peer();
  let data_conn: DataConnection;
  async function connect_data() {
    data_conn = await connect_peer(peer, game as PeerID, { client_id });
    setTimeout(() => handlers.onConnect(), 0);
    return new Promise((resolve, reject) => {
      data_conn.on("error", () => {
        keep_trying(connect_data, 1000);
      });
      data_conn.on("close", () => {
        keep_trying(connect_data, 1000);
      });

      const on_first_message = (d: any) => {
        data_conn.off("data", on_first_message);
        data_conn.on("data", handlers.onMessage);
        handlers.onInitialMessage(d);
        resolve(d);
      };
      data_conn.on("data", on_first_message);

      data_conn.on("error", () => handlers.onDisconnect());
      data_conn.on("close", () => handlers.onDisconnect());
    });
  }

  await connect_data();
  return {
    id: client_id,
    send(msg: any): void {
      data_conn.send(msg);
    },
  };
}

// Waits timeout between calling f again. stops when f returns true
function keep_trying(f: () => Promise<any>, timeout: number) {
  setTimeout(async () => {
    try {
      await f();
    } catch {
      keep_trying(f, timeout);
    }
  }, timeout);
}
