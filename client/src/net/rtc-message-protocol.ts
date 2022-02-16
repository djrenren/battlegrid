import { Resource } from "../fs/resource-manager";
import { GameEvent } from "../game/game-events";
import { read_stream, write_stream, type RTCMessage } from "./rtc-data-stream";

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

export const decoder = (): TransformStream<RTCMessage, LogicalMessage> => {
  let buffer: (ArrayBuffer | Blob | ArrayBufferView)[] = [];
  let file: MetaFile | undefined;

  return new TransformStream({
    start() {},
    async transform(chunk, controller) {
      switch (typeof chunk) {
        case "string":
          let meta = JSON.parse(chunk) as MetaMessage;
          if (meta.type === "event") {
            controller.enqueue(meta.event);
            return;
          }
          file = meta;
          break;
        default:
          // Must be a bytechunk now
          if (!file) {
            return;
          }
          buffer.push(chunk as any);
          if (--file.chunks === 0) {
            controller.enqueue({ type: "file", res_name: file.name, contents: new Blob(buffer) });

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

const MAX_MESSAGE_SIZE = 64 * 1000;
export const encoder = (): TransformStream<LogicalMessage, RTCMessage> => {
  return new TransformStream({
    start() {},
    async transform(chunk, controller) {
      if (chunk.type === "file") {
        // For files, first send the metadata
        controller.enqueue(
          JSON.stringify({
            type: "file",
            res_name: chunk.res_name,
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

export const proto_pair = (dc: RTCDataChannel): { writable: WritableStream<LogicalMessage>; readable: ReadableStream<LogicalMessage> } => {
  let readable = read_stream(dc).pipeThrough(decoder());
  let enc = encoder();

  enc.readable.pipeTo(write_stream(dc));
  let writable = enc.writable;
  return { writable, readable };
};
