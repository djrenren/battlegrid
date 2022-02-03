import { GameClient } from "../game/game-client";
import { GameEvent } from "../game/game-events";
import { Peer } from "./peer";
import { DurableSignaler } from "./signaling";

export class Client implements GameClient {
    #signaler: DurableSignaler;
    #peer: Peer;

    constructor(signaler: DurableSignaler, peer: Peer) {
        this.#signaler = signaler;
        this.#peer = peer;
        peer.on_data = (_, data) => this.on_event(JSON.parse(data));
    }

    static async establish(game_id: string) {
        let signaler = await DurableSignaler.establish(new URL("wss://battlegrid-signaling.herokuapp.com/"));
        let peer = await signaler.connect_to(game_id);
        return new Client(signaler, peer);
    }

    on_event = (_: GameEvent) => {};
    send(ev: GameEvent): void {
        this.#peer.send('control', JSON.stringify(ev));
    }
}