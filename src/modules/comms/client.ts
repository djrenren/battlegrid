import Peer from "peerjs";


export type ClientConfig = {
  onMessage(msg: any): void
}

export class Client {
  private server: Peer.DataConnection;

  private constructor(server: Peer.DataConnection, config: ClientConfig) {
    this.server = server;
    this.server.on('data', d => {
      config.onMessage(d)
    })
    this.server.on('error', d => {
      console.log("ERROR!")
    })
  }

  static async connect(serverId: string, config: ClientConfig): Promise<Client> {
    const peer = new Peer(undefined, {debug: 3});
    let connected = false;
    return new Promise((resolve, reject) => {
      peer.on('open', id => {
        const server = peer.connect(serverId, {reliable: true,});
        let client = new Client(server, config);
        server.on("open", () => {
          console.log("Open sesame?")
          connected = true;
          resolve(client)
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
} 