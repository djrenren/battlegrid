import { GameClient } from "../game/game-client";
import { GameEvent } from "../game/game-events";
import { Peer } from "./peer";
import { DurableSignaler } from "./signaling";

export class Server implements GameClient {
    signaler: DurableSignaler;
    #peers: Peer[] = [];

    constructor(signaler: DurableSignaler) {
        this.signaler = signaler;
        this.signaler.addEventListener('peer', ({detail: peer}) => {
            this.#peers.push(peer);
            peer.on_data = (_, data) => this.#on_data(peer, data);
        });
    }

    static async establish(): Promise<Server> {
        return new Server(await DurableSignaler.establish(new URL("wss://battlegrid-signaling.herokuapp.com/")));
    }

    #on_data(src: Peer | null, data: any) {
        if(src) {
            let ev = JSON.parse(data);
            this.on_event(ev);
        }
        for(let p of this.#peers) {
            if (p !== src) {
                p.send('control', data);
            }
        }
    }

    on_event = (_: GameEvent) => {};
    send(ev: GameEvent): void {
        this.#on_data(null, JSON.stringify(ev));
    }
}