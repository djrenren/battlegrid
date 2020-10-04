import { DataConnection } from "peerjs";
import { ConnId } from ".";
import { create_peer, PeerID } from "./peer";

type Config = {
  onStartup(): void;
  onConnect(player: ConnId): void;
  onDisconnect(label: ConnId): void;
  onMessage(msg: any): void;
};

export interface ServerClient {
  send(msg: any): void;
  readonly id: string;
}

export async function game_server(server_id: string, handlers: Config) {
  const peer = await create_peer(server_id as PeerID);
  const clients = new Map<string, DataConnection>();
  const broadcast = (data: any, exclude?: string) => {
    for (let [label, c] of clients) {
      if (label !== exclude) c.send(data);
    }
  };

  peer.on("connection", (conn) =>
    conn.on("open", () => {
      const client_id = conn.metadata.client_id as ConnId;
      console.log("NEW CLIENT", client_id);
      clients.set(client_id, conn);

      conn.on("data", (d) => {
        broadcast(d, client_id);
        handlers.onMessage(d);
      });
      conn.on("close", () => {
        clients.delete(client_id);
        handlers.onDisconnect(client_id as ConnId);
      });
      conn.on("error", () => {
        clients.delete(client_id);
        handlers.onDisconnect(client_id as ConnId);
      });

      handlers.onConnect(conn.metadata.client_id);
    })
  );

  handlers.onStartup();

  return {
    id: server_id,
    send: broadcast,
    sendTo(label: string, msg: any) {
      clients.get(label)!.send(msg);
    },
  };
}
