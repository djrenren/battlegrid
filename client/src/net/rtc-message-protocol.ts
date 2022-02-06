import { GameEvent } from "../game/game-events";
import { type RTCMessage } from "./rtc-data-stream";

export type LogicalMessage = GameEvent;

// MetaMessages are exchanged internally by the wire protocol so they aren't exported
type MetaMessage = MetaEvent | MetaFile;

type MetaEvent = {
  type: "event";
  event: any;
};

type MetaFile = {
  type: "file";
  name: string;
  chunks: number;
};

type WireMessage = MetaMessage | ArrayBuffer | ArrayBufferView | Blob;

export const decoder = (): TransformStream<RTCMessage, LogicalMessage> => {
  let buffer: (ArrayBuffer | Blob | ArrayBufferView)[] = [];
  let file: MetaFile | undefined;

  return new TransformStream({
    start() {},
    async transform(chunk, controller) {
      console.log("decoding----------");
      switch (typeof chunk) {
        case "string":
          let meta = JSON.parse(chunk) as MetaMessage;
          if (meta.type === "event") {
            controller.enqueue(meta.event);
            return;
          }
          console.log("is file", chunk);
          file = meta;
          break;
        default:
          console.log("found blob chunk", chunk);
          // Must be a bytechunk now
          if (!file) {
            console.error("Found chunk without metadata. Ignoring");
            return;
          }
          buffer.push(chunk as any);
          if (--file.chunks === 0) {
            console.log("file complete");
            controller.enqueue({ type: "file", name: file.name, contents: new Blob(buffer) });

            // Don't retain the buffer
            buffer = [];
            return;
          }
      }
    },
    flush() {
      buffer = [];
    },
  });
};

const MAX_MESSAGE_SIZE = 16 * 1000;
export const encoder = (): TransformStream<LogicalMessage, RTCMessage> => {
  return new TransformStream({
    start() {},
    async transform(chunk, controller) {
      console.log("TRANSFORMING------");
      if (chunk.type === "file") {
        console.log("is file", chunk);
        // For files, first send the metadata
        controller.enqueue(
          JSON.stringify({
            type: "file",
            name: chunk.name,
            chunks: Math.ceil(chunk.contents.size / MAX_MESSAGE_SIZE),
          })
        );

        // Then send the chunks
        for (let i = 0; i < chunk.contents.size; i += MAX_MESSAGE_SIZE) {
          controller.enqueue(await chunk.contents.slice(i, Math.min(i + MAX_MESSAGE_SIZE, chunk.contents.size)).arrayBuffer());
        }
      } else {
        controller.enqueue(
          JSON.stringify({
            type: "event",
            event: chunk,
          })
        );
      }
    },
  });
};
