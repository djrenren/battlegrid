import { v4 as uuidv4 } from 'uuid';
import Peer, { DataConnection } from 'peerjs';
const { PEERJS_ROOM_PREFIX } = process.env;

type PeerID = string & {__roomId: string}


export function generate_id(): PeerID {
  return PEERJS_ROOM_PREFIX + uuidv4() as PeerID;
}

export class ResilientClient {
  private dc: DataConnection
  private remote_id: PeerID

  private constructor(dc: DataConnection, remote_id: PeerID) {
    this.dc = dc;
    this.remote_id = remote_id;

    this.dc.on('error', () => {
      const interval = setInterval(async () => {
        try {
          this.dc = await connect_to_game(this.remote_id);
          clearInterval(interval);
        } catch {
          console.log("Failed to reconnect");
        }
      }, 1000)
    });
  }

  send(msg: any): void {
    this.dc.send(msg);
  }

  static async create(remote_id: PeerID): Promise<ResilientClient> {
    const dc = await connect_to_game(remote_id);
    return new ResilientClient(dc, remote_id);
  }
}

async function connect_to_game(id: PeerID): Promise<DataConnection> {
  return await connect_peer(await create_peer(), id);
}

async function create_peer(id?: PeerID): Promise<Peer> {
  let peer = new Peer(id);
  return new Promise((resolve, reject) => {
    let connected = false;
    let on_error = (e: any) => {
      cleanup();
      reject(`Error establishing peer: ${e}`)
    }
    let on_open = () => {
      cleanup();
      resolve(peer);
    }
    let cleanup = () => {
      peer.off('open', on_open);
      peer.off('error', on_error);
    }
    peer.on('open', on_open);
    peer.on('error', on_error);
  })
}

async function connect_peer(peer: Peer, id: PeerID): Promise<DataConnection> {
  const dc = peer.connect(id);
  return new Promise((resolve, reject) => {
    let connected = false;
    let on_error = (e: any) => {
      cleanup();
      reject(`Error establishing peer: ${e}`)
    }
    let on_open = () => {
      cleanup();
      resolve(dc);
    }
    let cleanup = () => {
      peer.off('open', on_open);
      peer.off('error', on_error);
    }
    peer.on('open', on_open);
    peer.on('error', on_error);
  })
}