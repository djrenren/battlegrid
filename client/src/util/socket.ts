const HEARTBEAT_INTERVAL = 3000;
export function with_heartbeat(ws: WebSocket): WebSocket {
  let live = true;
  let interval = setInterval(() => {
    if (!live) {
      console.error("Server failed to respond to heartbeat");
      ws.close(1000, "Heartbeat failure");
      clearInterval(interval);
      ws.dispatchEvent(new Event("hard-disconnect"));
    }
    live = false;
    ws.send("__ping__");
  }, HEARTBEAT_INTERVAL);

  ws.addEventListener("message", (msg) => {
    if (msg.data === "__pong__") {
      msg.stopImmediatePropagation();
      console.log("ponging");
      live = true;
    }
  });

  ws.addEventListener(
    "error",
    () => {
      clearInterval(interval);
    },
    { once: true }
  );
  ws.addEventListener(
    "close",
    () => {
      clearInterval(interval);
    },
    { once: true }
  );

  return ws;
}
