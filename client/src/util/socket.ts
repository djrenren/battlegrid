export async function open(ws: WebSocket): Promise<WebSocket> {
  if (ws.readyState === WebSocket.OPEN) {
    return ws;
  }

  return new Promise((resolve, reject) => {
    ws.addEventListener("error", reject, { once: true });
    ws.addEventListener(
      "open",
      () => {
        ws.removeEventListener("close", reject);
        resolve(ws);
      },
      { once: true }
    );
  });
}

export function stream<R, W>(socket: WebSocket): ReadableWritablePair<R, W> {
  const readable = new ReadableStream({
    start(controller) {
      socket.onmessage = ({ data }) => controller.enqueue(data);
      socket.onclose = (ev) => {
        controller.error(ev.reason);
      };
    },

    cancel() {
      socket.close();
    },
  });

  let resume: (() => void) | undefined;
  const writable = new WritableStream({
    start(controller) {
      socket.onclose = (ev) => controller.error(ev.reason);
      socket.addEventListener("open", () => resume && resume(), { once: true });
    },

    async write(data) {
      if (socket.readyState !== WebSocket.OPEN) {
        await new Promise<void>((resume) => socket.addEventListener("open", () => resume(), { once: true }));
      }

      socket.send(data);
    },

    abort() {
      socket.close();
    },

    close() {
      socket.close();
    },
  });

  return { readable, writable };
}
