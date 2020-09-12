import Peer from "peerjs";
import { ConnId } from ".";

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
        console.log("NEW CLIENT");
        const label = conn.label as ConnId;
        this.clients.set(label, conn);
        config.onConnect && config.onConnect(label);
        config.onDisconnect && conn.on('close', () => {
          config.onDisconnect!(label)
        })
        conn.on('data', d => {
          this.broadcast_json(d, conn.label)
          config.onMessage && config.onMessage(d);
        });
        conn.on('close', () => {
          this.clients.delete(conn.label)
        })
        conn.on('error', () => {
          this.clients.delete(conn.label)
        })
      })
    })

    this.peer.on('disconnected', () => {
      console.error("ACK! Disconnect from signaler.")
    })
  }

  static async create(id: undefined | string, config: Config): Promise<Server> {
    const peer = new Peer(id, { debug: 3 });
    let connected = false;
    return new Promise((resolve, reject) => {
      peer.on("open", id => {
        connected = true;
        resolve(new Server(id, peer, config))
      });
      peer.on("error", e => {
        connected && reject(`Failed to create server: ${e}`)
      })
    })
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