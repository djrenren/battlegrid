import { flush, MAX_MESSAGE_SIZE } from "../../util/rtc";
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

  // console.log("Built buffer", blob);
  return {
    blob,
  };
}

export async function response(
  dc: ReadableWritablePair<ArrayBuffer | string, ArrayBuffer | string>,
  resource: Resource,
  msg_size: number = MAX_MESSAGE_SIZE
) {
  console.log("USING MAX MESSAGE SIZE: ", msg_size);
  let writer = dc.writable.getWriter();
  await writer.write(JSON.stringify({ type: resource.blob.type }));
  writer.releaseLock();

  await buffer_chunks(resource.blob, msg_size).pipeTo(dc.writable, { preventClose: true });
}
