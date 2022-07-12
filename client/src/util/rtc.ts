import { Status } from "./net";

export type RTCMessage = string | ArrayBuffer | ArrayBufferView | Blob;

export const streams = <R extends RTCMessage, W extends RTCMessage>(dc: RTCDataChannel): ReadableWritablePair<R, W> => ({
  readable: read_stream(dc) as ReadableStream<R>,
  writable: write_stream(dc),
});

export const open = async (conn: RTCPeerConnection): Promise<RTCPeerConnection> => {
  console.log("OPEN");
  if (conn.iceConnectionState === "connected") {
    console.log("WAT");
    return conn;
  }

  return new Promise((resolve, reject) => {
    console.log("P", conn.iceConnectionState);
    const listener = () => {
      console.log("OPEN", conn.iceConnectionState);
      if (["failed", "closed"].includes(conn.iceConnectionState)) {
        console.log("NAILED IT");
        reject("Failed to connect");
        conn.removeEventListener("iceconnectionstatechange", listener);
      } else if (conn.iceConnectionState === "connected") {
        resolve(conn);
        conn.removeEventListener("iceconnectionstatechange", listener);
      }
    };
    conn.addEventListener("signalingstatechange", (ev) => {
      console.log("SIGNAL", ev);
    });
    conn.addEventListener("iceconnectionstatechange", listener);
  });
};

const read_stream = (dc: RTCDataChannel): ReadableStream<RTCMessage> => {
  return new ReadableStream({
    start(controller) {
      dc.onmessage = ({ data }) => {
        controller.enqueue(data);
      };
      const onclose = () => {
        if (dc.bufferedAmount === 0) {
          console.log("Underlying datachannel closed");
          controller.close();
        } else {
          dc.addEventListener("bufferedamountlow", () => {
            console.log("Underlying datachannel closed");
            controller.close();
          });
        }
      };
      dc.addEventListener("close", onclose, { once: true });
    },

    cancel() {
      dc.close();
    },
  });
};

export const flush = (dc: RTCDataChannel): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const try_close = () => {
      if (dc.bufferedAmount === 0) {
        return resolve();
      }

      if (dc.readyState === "closed" || dc.readyState === "closing") {
        return reject("Buffer closed before flushing");
      }
    };

    dc.bufferedAmountLowThreshold = 0;
    dc.addEventListener("bufferedamountlow", try_close);
    try_close();
  });
};

export const dc_status = (dc: RTCDataChannel): Status => {
  switch (dc.readyState) {
    case "open":
    case "closed":
      return dc.readyState;
    case "closing":
      return "closed";
    case "connecting":
      return "opening";
  }
};

const write_stream = (dc: RTCDataChannel): WritableStream<RTCMessage> => {
  let resume: (() => void) | undefined;
  dc.addEventListener("error", (err) => console.log("DC ERROR", err));
  return new WritableStream(
    {
      start(controller) {
        const onclose = () => {
          console.log("stream closed by dc ending", dc.label);
          controller.error("Closed foo");
          dc.removeEventListener("close", onclose);
        };
        dc.addEventListener("close", onclose);
        dc.onopen = () => resume && resume();
        dc.onbufferedamountlow = () => resume && resume();
      },
      async write(chunk) {
        if (dc.readyState === "connecting" || dc.bufferedAmount > dc.bufferedAmountLowThreshold) {
          console.log("waiting for resumptoin...");
          await new Promise<void>((r, _) => (resume = r));
          console.log("resumed!");
        }
        console.log("writing", chunk);
        dc.send(chunk);
      },
      abort() {
        console.log("aborted dc by stream");
        dc.close();
      },
      close() {
        console.log("closed dc by stream");
        dc.close();
      },
    },
    // Don't let the output stream consume more than one message in case it gets shutdown
    new CountQueuingStrategy({ highWaterMark: 1 })
  );
};
