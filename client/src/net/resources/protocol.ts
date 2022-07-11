import { consume } from "../../util/streams";

export const RESOURCE_PROTOCOL = "request-resource";

export type Resource = {
  blob: Blob;
};

type Header = {
  type: string;
};

export async function request(channel: ReadableWritablePair<ArrayBuffer | string, ArrayBuffer | string>): Promise<Resource> {
  let buffer: ArrayBuffer[] = [];
  let header: Header | undefined;
  try {
    await consume(channel.readable, (chunk) => {
      if (typeof chunk === "string") {
        header = JSON.parse(chunk);
        return;
      }
      console.log("READING resource CHUNK");
      buffer.push(chunk);
    });
  } catch (e) {
    console.error("Error consuming", e);
  }

  console.log(buffer);
  let blob = new Blob(buffer, { type: header?.type });

  console.log("GOT EM ALL!", blob);
  return {
    blob,
  };
}

const MAX_MESSAGE_SIZE = 64 * 1000;
export async function response(dc: ReadableWritablePair<ArrayBuffer | string, ArrayBuffer | string>, resource: Resource) {
  let blob = resource.blob;
  let writer = dc.writable.getWriter();
  console.log("BLOBL", blob);

  writer.write(JSON.stringify({ type: blob.type }));
  // Then send the chunks
  for (let i = 0; i < blob.size; i += MAX_MESSAGE_SIZE) {
    console.log("WRITING FIRST ChUNK");
    //@ts-ignore
    await writer.write(await blob.slice(i, Math.min(i + MAX_MESSAGE_SIZE, blob.size)).arrayBuffer());
  }

  console.error("closing");
  await writer.close();
}
