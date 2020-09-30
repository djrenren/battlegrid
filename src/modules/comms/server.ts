import Peer from "peerjs";
import { ConnId } from ".";
import { create_peer, PeerID } from "./peer";

type Config = {
  onConnect?(label: ConnId): void
  onDisconnect?(label: ConnId): void
  onMessage?(msg: any): void
}

export interface ServerClient {
  send(msg: any): void;
  readonly id: string,
}


export class Server implements ServerClient {
  private peer: Peer;
  private clients: Map<string, Peer.DataConnection>;
  readonly id: string;

  private constructor(id: string, peer: Peer, config: Config) {
    this.peer = peer;
    this.id = id;
    this.clients = new Map();

    this.peer.on('connection', conn => {
      conn.on('open', () => {
        console.log("NEW CLIENT", conn.peer);
        const label = conn.peer as ConnId;
        this.clients.set(label, conn);
        config.onConnect && config.onConnect(label);
        conn.on('data', d => {
          this.broadcast_json(d, conn.peer)
          config.onMessage && config.onMessage(d);
        });
        conn.on('close', () => {
          this.clients.delete(conn.peer)
        })
        conn.on('error', () => {
          this.clients.delete(conn.peer)
        })
        config.onDisconnect && conn.on('close', () => {
          console.log('close?')
          config.onDisconnect!(label)
        })
        config.onDisconnect && conn.on('error', () => {
          console.log('error?')
          config.onDisconnect!(label)
        })
      })
    })

    this.peer.on('disconnected', () => {
      console.error("ACK! Disconnect from signaler.")
    })
  }

  static async create(id: undefined | string, config: Config): Promise<Server> {
    const peer = await create_peer(id as PeerID);
    return new Server(peer.id, peer, config);
  }

  private broadcast_json(msg: any, exclude: string | null = null) {
    for (let [label, c] of this.clients) {
      if(label !== exclude)
        c.send(msg);
    }
  }

  send(msg: any) {
    this.broadcast_json(msg);
  }

  sendTo(label: string, msg: any) {
    this.clients.get(label)!.send(msg);
  }
}