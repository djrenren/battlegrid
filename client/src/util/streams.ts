import { readBuilderProgram, resolveModuleName } from "typescript";

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

export async function consume<R>(r: ReadableStream<R>, write: (chunk: R) => any, signal?: AbortSignal): Promise<void> {
  return r.pipeTo(new WritableStream({ write }), { signal });
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

// export function pip(): ReadableWritablePair<any, any> {
//   let reader;
//   let writer;
//   let controller: ReadableStreamDefaultController;
//   reader = new ReadableStream({
//     start(controller) {controller = controller}
//   });
//   writer = new WritableStream({
//     write(chunk) {
//       controller.enqueue
//     }
//   })
// }

// /**
//  * Creates a a stable stream by reproducing an underlying stream whenever it closes
//  * @param builder the constructor for the underlying stream
//  * @returns A stream
//  */
// export function durable<R, W>(builder: () => Promise<ReadableWritablePair<R, W>>): ReadableWritablePair<R, W> {
//   let underlying: Promise<{
//     writer: WritableStreamDefaultWriter,
//     reader: ReadableStreamDefaultReader,
//   }>

//   let timeout: Promise<void> = Promise.resolve();
//   let nobuffer = new CountQueuingStrategy({highWaterMark: 0});
//   let loading = false;
//   let reload = () => {
//     console.log('requesting a reload');
//     if (loading) { return; }
//     console.log('performing a reload');
//     loading = true;
//     underlying?.then(u => {
//       u.reader.closed || u.reader.cancel("Restarting stream");
//       u.writer.closed || u.writer.close();
//     })

//     underlying = timeout.then(() => builder()).then(({readable, writable}) => ({
//       reader: readable.getReader(),
//       writer: writable.getWriter(),
//     }))
//     timeout = new Promise(resolve => setTimeout(resolve, 1000));
//     underlying.finally(() => loading = false);
//   }

//   reload();

//   let writable = new WritableStream({
//     async write(chunk) {
//       while(true) {
//         try {
//           console.log("WRITING CHUNK", chunk);
//           await ((await underlying).writer).write(chunk);
//           console.log("CHUNK WRITTEN");
//           return;
//         } catch (e){
//           console.error("Error writing: ", e, "... reloading");
//           reload();
//         }
//       }
//     },
//     async abort(reason) {
//       console.log("writable aborted");;
//       try {
//         await ((await underlying).writer).abort(reason);

//       } catch {}
//     },

//     async close() {
//       console.log("writable closed");;
//       try {
//         await ((await underlying).writer).close();
//       } catch {}
//     }
//   }, nobuffer)

//   let canceled = false;
//   let readable = new ReadableStream({
//     async pull(controller) {
//       while(!canceled) {
//         try {
//           let {done, value} = await ((await underlying).reader).read();
//           if (!done) {
//             controller.enqueue(value);
//             return;
//           }
//         } catch {}

//         reload();
//       }
//     },

//     async cancel(reason) {
//       canceled = true;
//       console.log("readable canceled");
//       try {
//         await ((await underlying).reader).cancel(reason);
//       } catch {}
//     }
//   }, nobuffer);

//   return {
//     readable,
//     writable,
//   };
// }
