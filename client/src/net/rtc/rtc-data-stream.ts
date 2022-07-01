export type RTCMessage = string | ArrayBuffer | ArrayBufferView | Blob;

export const streams = (dc: RTCDataChannel): ReadableWritablePair<RTCMessage, RTCMessage> => ({
  readable: read_stream(dc),
  writable: write_stream(dc),
})

const read_stream = (dc: RTCDataChannel): ReadableStream<RTCMessage> => {
  return new ReadableStream({
    start(controller) {
      dc.onmessage = ({ data }) => {
        console.log("RECEIVED", data);
        controller.enqueue(data);
      }
      const onclose = () => {
        controller.close();
        dc.removeEventListener("close", onclose);
      };
      dc.addEventListener("close", onclose);
    },

    cancel() {
      dc.close();
    },
  });
};

const write_stream = (dc: RTCDataChannel): WritableStream<RTCMessage> => {
  let resume: (() => void) | undefined;
  return new WritableStream(
    {
      start(controller) {
        const onclose = () => {
          controller.error("Closed");
          dc.removeEventListener("close", onclose);
        };
        dc.addEventListener("close", onclose);
        dc.onopen = () => resume && resume();
        dc.onbufferedamountlow = () => resume && resume();
      },
      async write(chunk) {
        if (dc.readyState === "connecting" || dc.bufferedAmount > dc.bufferedAmountLowThreshold) {
          await new Promise<void>((r, _) => (resume = r));
        }
        dc.send(chunk);
      },
      abort() {
        dc.close();
      },
    },
    // Don't let the output stream consume more than one message in case it gets shutdown
    new CountQueuingStrategy({ highWaterMark: 1 })
  );
};
