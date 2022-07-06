import { consume } from "../../util/streams";

export const RESOURCE_PROTOCOL = "request-resource";

export type Resource = {
  blob: Blob;
};

export async function request(channel: ReadableWritablePair<ArrayBuffer, ArrayBuffer>): Promise<Resource> {
  let buffer: ArrayBuffer[] = [];

  await consume(channel.readable, async (chunk) => {
    console.log("READING resource CHUNK");
    buffer.push(chunk);
  });

  return {
    blob: new Blob(buffer),
  };
}

const MAX_MESSAGE_SIZE = 64 * 1000;
export async function response(dc: ReadableWritablePair<ArrayBuffer, ArrayBuffer>, resource: Resource) {
  let blob = resource.blob;
  let writer = dc.writable.getWriter();
  console.log("BLOBL", blob);
  // Then send the chunks
  for (let i = 0; i < blob.size; i += MAX_MESSAGE_SIZE) {
    console.log("WRITING FIRST ChUNK");
    //@ts-ignore
    await writer.write(await blob.slice(i, Math.min(i + MAX_MESSAGE_SIZE, blob.size)).arrayBuffer());
  }

  console.error("closing");
  await writer.close();
}
