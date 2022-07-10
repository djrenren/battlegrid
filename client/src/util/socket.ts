export async function open(ws: WebSocket): Promise<WebSocket> {
  if (ws.readyState === WebSocket.OPEN) {
    return ws;
  }

  return new Promise((resolve, reject) => {
    ws.addEventListener("close", reject, { once: true });
    ws.addEventListener("error", reject, { once: true });
    ws.addEventListener(
      "open",
      () => {
        ws.removeEventListener("close", reject);
        ws.removeEventListener("error", reject);
        resolve(ws);
      },
      { once: true }
    );
  });
}

const HEARTBEAT_INTERVAL = 3000;
export function with_heartbeat(ws: WebSocket): WebSocket {
  let live = true;
  let interval = setInterval(() => {
    if (!live) {
      console.error('Server failed to respond to heartbeat');
      ws.close(1000, 'Heartbeat failure');
    }
    live = false;
    ws.send('__ping__')
  }, HEARTBEAT_INTERVAL);

  ws.addEventListener('message', msg => {
    if (msg.data === '__pong__') {
      console.log('ponging');
      live = true;
    }
  })

  ws.addEventListener('close', () => {
    clearInterval(interval)
  }, {once: true});

  return ws;
}

export function stream<R, W>(socket: WebSocket): ReadableWritablePair<R, W> {

  const close_socket = () => {
    [socket.CLOSED, socket.CLOSING].includes(socket.readyState) || socket.close();
  }
  const readable = new ReadableStream({
    start(controller) {
      socket.onmessage = ({ data }) => {
        if (data !== '__pong__') controller.enqueue(data);
      };

      socket.addEventListener('close', (ev) => controller.error(ev.reason), {once: true});
    },

    cancel: close_socket
  });

  let resume: (() => void) | undefined;
  const writable = new WritableStream({
    start(controller) {
      socket.addEventListener('close', (ev) => controller.error(ev.reason), {once: true});
      socket.addEventListener("open", () => resume && resume(), { once: true });
    },

    async write(data) {
      console.log(socket.readyState);
      socket.send(data);
    },

    abort: close_socket,
    close: close_socket
  }, new CountQueuingStrategy({highWaterMark: 0}));

  return { readable, writable };
}
