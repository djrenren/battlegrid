import { Peer } from "./rtc/peer";

export class DurableSignaler extends EventTarget {
  #ident: string;
  #socket: WebSocket;
  #shutdown: Boolean = false;
  #status: Status = "connected";
  #peers: Map<string, Peer> = new Map();

  get ident() {
    return this.#ident;
  }

  get status() {
    return this.#status;
  }

  private constructor(ident: string, socket: WebSocket) {
    super();
    this.#ident = ident;
    this.#socket = socket;
  }

  static async establish(signaling_server: URL, suggested_id?: string): Promise<DurableSignaler> {
    if (suggested_id) {
      signaling_server.pathname = "/" + suggested_id;
    }

    let socket = await this.#get_socket(signaling_server);
    console.log("acquired socket for ", suggested_id);
    return new Promise((resolve, reject) => {
      socket.addEventListener(
        "message",
        (assignment) => {
          let x = JSON.parse(assignment.data);
          socket.removeEventListener("close", reject);

          let signaler = new DurableSignaler(x.id, socket);
          signaler.#establish_handlers();

          resolve(signaler);
        },
        { once: true }
      );

      socket.addEventListener("close", reject);
    });
  }

  static async #get_socket(url: URL): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      let ws = new WebSocket(url.toString());
      ws.addEventListener("close", (e) => reject(e), { once: true });
      ws.addEventListener("open", () => {
        console.log("WS CONNECTED");
        ws.removeEventListener("close", reject);
        resolve(ws);
      });
    });
  }

  #establish_handlers() {
    let url = new URL(this.#socket.url);

    this.#socket.addEventListener("error", (detail) => {
      this.dispatchEvent(new CustomEvent("error", { detail }));
    });

    this.#socket.addEventListener("close", () => this.#reconnect(url));

    // We assume JSON parsing will always succeed because the server enforces this
    this.#socket.addEventListener("message", (ev) => {
      let data = JSON.parse(ev.data);

      this.#handle_message(data);
    });
  }

  async connect_to(remote_peer: string): Promise<Peer> {
    let peer = new Peer((s) => {
      this.#socket.send(
        JSON.stringify({
          target: remote_peer,
          ...s,
        })
      );
      if (s.type === "shutdown") {
        this.#peers.delete(s.from);
      }
    });

    this.#peers.set(remote_peer, peer);

    await peer.initiate();

    return peer;
  }

  #set_status(status: Status) {
    this.#status = status;
    this.dispatchEvent(new CustomEvent("status", { detail: status }));
  }

  async #reconnect(url: URL) {
    let socket;

    url.pathname = "/" + this.#ident;

    if (this.#shutdown) {
      this.#set_status("closed");
      return;
    }

    this.#set_status("disconnected");

    try {
      socket = await DurableSignaler.#get_socket(url);
    } catch (e) {
      console.error("Error reconnecting", e);
      setTimeout(() => this.#reconnect, 1000);
      return;
    }

    this.#socket = socket;
    this.#establish_handlers();
    this.#set_status("connected");
  }

  /** ONLY FOR TESTING: Triggers a socket disconnect */
  _disconnect() {
    this.#socket.close();
  }

  /** Permanently closes the connection */
  close() {
    this.#shutdown = true;
    this.#socket.close();
  }

  #handle_message(s: any) {
    console.log(s);
    if (s.error) {
      this.dispatchEvent(
        new CustomEvent("error", {
          detail: s.error,
        })
      );
      return;
    }

    if (s.type === "offer" && !this.#peers.has(s.from)) {
      let peer = new Peer((m) => {
        this.#socket.send(
          JSON.stringify({
            target: s.from,
            ...m,
          })
        );
        if (s.type === "shutdown") {
          this.#peers.delete(s.from);
        }
      });

      this.#peers.set(s.from, peer);
      peer.signal(s);
      this.dispatchEvent(new CustomEvent("peer", { detail: peer }));
    } else {
      this.#peers.get(s.from)?.signal(s);
      if (s.type === "shutdown") {
        this.#peers.delete(s.from);
      }
    }
  }
}

export type Status = "connected" | "disconnected" | "closed";
export type StatusEvent = CustomEvent<Status>;
export interface DurableSignaler {
  addEventListener(type: "message", callback: (msg: CustomEvent) => void, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: "status", callback: (msg: StatusEvent) => void, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: "peer", callback: (msg: CustomEvent<Peer>) => void, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: "error", callback: (msg: CustomEvent) => void, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListener | EventListenerObject, useCapture?: boolean): void;
}
