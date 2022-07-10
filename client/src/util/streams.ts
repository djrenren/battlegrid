export function pipe<T>(): [ReadableWritablePair<T, T>, ReadableWritablePair<T, T>] {
  let left_to_right = new TransformStream();
  let right_to_left = new TransformStream();

  return [
    {
      readable: right_to_left.readable,
      writable: left_to_right.writable,
    },
    {
      readable: left_to_right.readable,
      writable: right_to_left.writable,
    },
  ];
}

export async function* iter<R>(r: ReadableStream<R>): AsyncIterable<R> {
  let done,
    value,
    reader = r.getReader();

  while (({ done, value } = await reader.read()) && !done) {
    yield value!;
  }
}

export async function consume<R>(r: ReadableStream<R>, write: (chunk: R) => Promise<void>): Promise<void> {
  return r.pipeTo(new WritableStream({ write }));
}

export function json<T>(r: ReadableWritablePair<string, string>): ReadableWritablePair<T, T> {
  let encode = new TransformStream<T, string>({
    transform(chunk, controller) {
      controller.enqueue(JSON.stringify(chunk));
    },
  });
  encode.readable.pipeTo(r.writable);

  return {
    readable: r.readable.pipeThrough(
      new TransformStream<string, T>({
        transform(chunk, controller) {
          controller.enqueue(JSON.parse(chunk));
        },
      })
    ),

    writable: encode.writable,
  };
}

export type Status = "connected" | "connecting" | "closed";

export interface AbortableStream<R, W> extends ReadableWritablePair<R, W> {
  abort(): Promise<void>;
}

/**
 * Creates a a stable stream by reproducing an underlying stream whenever it closes
 * @param builder the constructor for the underlying stream
 * @returns A stream
 */
export function durable<R, W>(builder: () => Promise<ReadableWritablePair<R, W>>): ReadableWritablePair<R, W> {
  let underlying;

  let writer: WritableStreamDefaultWriter<W> | undefined;
  let reader: ReadableStreamDefaultReader<R> | undefined;

  let promise: Promise<any> | undefined;
  let stop = false;
  let reload = async () => {
    if (stop) throw "No more reloading should occur";
    if (promise) return promise;
    return (promise = (async () => {
      underlying = await builder();
      writer = underlying.writable.getWriter();
      reader = underlying.readable.getReader();
      promise = undefined;
    })());
  };

  promise = reload();

  let writable = new WritableStream(
    {
      async write(chunk, controller) {
        if (!writer) {
          await reload();
        }

        try {
          await writer!.write(chunk);
        } catch {
          await reload();
        }
      },
      async close() {
        stop = true;
        await writer?.close();
      },
      async abort(reason) {
        await writer?.abort(reason);
      },
    },
    new CountQueuingStrategy({ highWaterMark: 50 })
  );

  let readable = new ReadableStream({
    async pull(controller) {
      let error = true;
      while (error) {
        if (!reader) {
          await reload();
          continue;
        }
        try {
          let { done, value } = await reader.read();
          if (done) {
            console.log("HUH");
            reader = undefined;
          } else {
            controller.enqueue(value);
          }
          error = false;
        } catch (e) {
          reader = undefined;
        }
      }
    },
    async cancel(reason) {
      await reader?.cancel(reason);
    },
  });

  return {
    readable,
    writable,
  };
}
