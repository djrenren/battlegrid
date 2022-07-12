import { buffer_chunks, collect_blob } from "../../util/streams";
export const RESOURCE_PROTOCOL = "request-resource";

export type Resource = {
  blob: Blob;
};

type Header = {
  type: string;
};

export async function request(channel: ReadableWritablePair<ArrayBuffer | string, ArrayBuffer | string>): Promise<Resource> {
  let reader = channel.readable.getReader();
  let first = await reader.read();
  console.log("header? ", first);
  let header: Header = JSON.parse(first.value as any);
  reader.releaseLock();

  let blob = await collect_blob(channel.readable as ReadableStream<ArrayBuffer>, header?.type);

  console.log("Built buffer");
  return {
    blob,
  };
}

const MAX_MESSAGE_SIZE = 64 * 1000;
export async function response(dc: ReadableWritablePair<ArrayBuffer | string, ArrayBuffer | string>, resource: Resource) {
  let writer = dc.writable.getWriter();
  await writer.write(JSON.stringify({ type: resource.blob.type }));
  writer.releaseLock();

  await buffer_chunks(resource.blob, MAX_MESSAGE_SIZE).pipeTo(dc.writable);
}
