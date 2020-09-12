import Peer, { DataConnection } from "peerjs";

export type PeerID = string & {__roomId: string}

export async function create_peer(id?: PeerID): Promise<Peer> {
  let peer = new Peer(id, { debug: 3 });
  return new Promise((resolve, reject) => {
    let on_error = (e: any) => {
      cleanup();
      reject(`Error establishing peer: ${e}`)
    }
    let on_open = () => {
      cleanup();
      console.log("OPENING?")
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

export async function connect_peer(peer: Peer, id: PeerID): Promise<DataConnection> {
  const dc = peer.connect(id);
  return new Promise((resolve, reject) => {
    let on_error = (e: any) => {
      cleanup();
      reject(`Error establishing peer: ${e}`)
    }
    let on_open = () => {
      cleanup();
      resolve(dc);
    }
    let cleanup = () => {
      dc.off('open', on_open);
      dc.off('error', on_error);
    }
    dc.on('open', on_open);
    dc.on('error', on_error);
  })
}