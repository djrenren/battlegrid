import { GameEvent, StateSync } from "../game/game-events";
import { ResourceEvent } from "./rtc/rtc-resource-encoder";

// All game events are reflected as response-less events on the protocol
type GameProtocol = {
    [K in GameEvent['type']]: {
        request: GameEvent & {type: K}
    };
}

const x: StateSync = 1 as unknown as any;
const y: GameProtocol = 1 as unknown as any;

export type Protocol = GameProtocol & {
    'resource': {
        request: ResourceEvent
    }
    'get_image': {
        request: {
            id: string
        },
        response: {
            data: Blob
        }
    }
}