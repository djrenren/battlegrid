import { Message } from "../client";
import { RTCMessage } from "./rtc-data-stream";

export type ResourceEvent = {
    type: 'resource',
    name: string,
    data: Blob
}


interface ResourceMetadata {
    header: any,
    data: {
        type: 'resource-metadata',
        name: string,
        chunks: number
    }
}


export const resources = (rw: ReadableWritablePair<RTCMessage, RTCMessage>): ReadableWritablePair<any, any> => {
    let encoder = resource_encoder();
    encoder.readable.pipeTo(rw.writable);

    let decoder = resource_decoder();
    rw.readable.pipeThrough(decoder);

    return {
        writable: encoder.writable,
        readable: decoder.readable
    }
};


const resource_decoder = (): TransformStream<RTCMessage, Message> => {
  let buffer: (ArrayBuffer | Blob | ArrayBufferView)[] = [];
  let file: ResourceMetadata | undefined;

  return new TransformStream({
    start() {},
    async transform(chunk, controller) {
      switch (typeof chunk) {
        case "string":
          const json = JSON.parse(chunk) as Message | ResourceMetadata;
          console.log("JSON?", json);
          if (json.data.type === 'resource-metadata') {
            console.log("META RECEIVED", json);
            file = json as ResourceMetadata;
          } else {
            controller.enqueue(json as Message)
          }
          break;
        default:
          // Must be a bytechunk now
          if (!file) {
            return;
          }

        console.log("CHUNK RECEIVED");
          buffer.push(chunk as any);
          if (--file.data.chunks === 0) {
            controller.enqueue({ 
                header: file.header, 
                data: {
                    type: 'resource',
                    name: file.data.name,
                    data: new Blob(buffer) 
                }
            });

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
const resource_encoder = (): TransformStream<Message, RTCMessage> => {
  return new TransformStream({
    start() {},
    async transform(chunk, controller) {
        if (chunk.data.type === 'resource') {
            let header = chunk.header;
            let data = chunk.data as ResourceEvent;
            console.log("ENCODE", chunk);
            let blob = data.data;
            // For files, first send the metadata
            controller.enqueue(
            JSON.stringify({
                header,
                data: {
                    type: 'resource-metadata',
                    name: data.name,
                    chunks: Math.ceil(blob.size / MAX_MESSAGE_SIZE),
                }
            } as ResourceMetadata)
            );

            // Then send the chunks
            for (let i = 0; i < blob.size; i += MAX_MESSAGE_SIZE) {
                console.log("CHUNKING!");
                controller.enqueue(await blob.slice(i, Math.min(i + MAX_MESSAGE_SIZE, blob.size)).arrayBuffer());
            }
        } else {
             controller.enqueue(
          JSON.stringify(chunk)
        );
        }
    },
  });
};