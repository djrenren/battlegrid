import { v4 as uuidv4 } from 'uuid';
import { DataConnection } from 'peerjs';
import { PeerID, connect_peer, create_peer } from './peer';
import { ServerClient } from './server';
const { PEERJS_ROOM_PREFIX } = process.env;


export type ClientConfig = {
  onConnect(self: Client): void
  onDisconnect(): void
  onMessage(msg: any): void
}

export function generate_id(): PeerID {
  return PEERJS_ROOM_PREFIX + uuidv4() as PeerID;
}

export class Client implements ServerClient {
  private dc: DataConnection
  private remote_id: PeerID
  private config: ClientConfig
  get id(): string {
    return this.dc.label
  }
  private constructor(dc: DataConnection, remote_id: PeerID, config: ClientConfig) {
    this.dc = dc;
    this.remote_id = remote_id;
    this.config = config;

    this.attachListeners(this.dc);
  }

  private attachListeners(dc: DataConnection) {
    this.dc.on('close', () => {
      const attemptConnect = async () => {
        this.config.onDisconnect();
        try {
          this.dc = await connect_to_game(this.remote_id);
          this.attachListeners(this.dc);
        } catch {
          console.log("failed to reconnect");
          setTimeout(attemptConnect, 1000)
        }
      }
      attemptConnect();
    });

    this.dc.on('error', () => {
      const attemptConnect = async () => {
        this.config.onDisconnect();
        try {
          this.dc = await connect_to_game(this.remote_id);
          this.attachListeners(this.dc);
        } catch {
          console.log("failed to reconnect");
          setTimeout(attemptConnect, 1000)
        }
      }
      attemptConnect();
    });

    this.dc.on('data', d => {
      console.log("INCOMING!");
      this.config.onMessage(d)
    })

    this.config.onConnect(this);
  }

  send(msg: any): void {
    this.dc.send(msg);
  }

  static async create(remote_id: PeerID, config: ClientConfig): Promise<Client> {
    const dc = await connect_to_game(remote_id);
    return new Client(dc, remote_id, config);
  }
}

async function connect_to_game(id: PeerID): Promise<DataConnection> {
  return await connect_peer(await create_peer(), id);
}
