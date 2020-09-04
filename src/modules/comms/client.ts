import Peer from "peerjs";
import { ServerClient } from "./server";


export type ClientConfig = {
  onConnect(self: Client): void
  onMessage(msg: any): void
}

export class Client implements ServerClient {
  private server: Peer.DataConnection;
  private peer: Peer;
  get id(): string {
    return this.peer.id;
  }
  private constructor(peer: Peer, server: Peer.DataConnection, config: ClientConfig) {
    this.server = server;
    this.peer = peer;
    this.server.on('data', d => {
      config.onMessage(d)
    })
    this.server.on('error', e => {
      console.error(e)
    })
  }

  static async connect(serverId: string, config: ClientConfig): Promise<Client> {
    const peer = new Peer(undefined, {debug: 3});
    let connected = false;
    return new Promise((resolve, reject) => {
      peer.on('open', id => {
        const server = peer.connect(serverId, {reliable: true,});
        server.on("open", () => {
          connected = true;
          let client = new Client(peer, server, config);
          setTimeout(() => config.onConnect(client), 0)
          resolve(client);
        });
        server.on("error", (e) => {
          !connected && reject(`Error connecting to game host: ${e}`)
        });
      });
      peer.on("error", (e) => {
        !connected && reject(`Error connecting to signaling server: ${e}`)
      })
    });
  }

  send(msg: any) {
    this.server.send(msg);
  }
} 