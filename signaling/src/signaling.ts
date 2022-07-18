import { type RawData, WebSocket, WebSocketServer } from 'ws';
import { type IncomingMessage, createServer } from 'http';

const HEARTBEAT_INTERVAL = 3000;

type PeerId = string & {__brand: 'peer_id'};

let peers = new Map<PeerId, WebSocket>();
let secrets = new Map<PeerId, string>();
function get_suggested_id(req: IncomingMessage): PeerId | null {
    let suggested_id = req.url?.substring(1);
    if (suggested_id && suggested_id.length > 0) {
        return suggested_id as PeerId
    } else {
        return null 
    }
}

let server = createServer();

const wss = new WebSocketServer({
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
 noServer: true 
});

setInterval(() => pingAll(), HEARTBEAT_INTERVAL);
function pingAll() {
    wss.clients.forEach(((ws: WebSocket & {isAlive: boolean, peer_id: PeerId}) => {
        console.log("PINGING", ws.isAlive);
      if (ws.isAlive === false) {
        peers.delete(ws.peer_id);
        return ws.terminate()
      };

      ws.isAlive = false;
      ws.ping();
    }) as any);
}

server.on('upgrade', (req, socket, head) => {
    let suggested_id = get_suggested_id(req);

    console.log(suggested_id)

    if (suggested_id && peers.has(suggested_id)) {
        return socket.end('HTTP/1.1 409 Conflict\r\n\r\n');
    }

    let id = suggested_id + "" as PeerId;


    wss.handleUpgrade(req, socket, head, (socket) => {
        (socket as any).isAlive = true;
        (socket as any).peer_id = id;
        peers.set(id, socket);
        console.log(id, "connected");
        //socket.send(JSON.stringify({type: "assignment", id}));
        socket.on('message', (data, isBinary) => {
            on_message.bind(socket)(id, data, isBinary);
        });
        socket.on("pong", () => {
            console.log("pong from", id);
            // let persisit = Math.random();
            // if (Math.random() < 0.1) {
                // console.log("Killing", id);
            // } else {
                (socket as any).isAlive = true;
            // }
        });
        socket.on('close', () => {
            console.log(id, "disconnected");
            peers.delete(id)
        });
    });
})


function on_message(this: WebSocket, from: string, data: RawData, isBinary: boolean) {
    console.log("MESSAGE:", data);
    if (isBinary) {
        return this.close(1011, "Signaling server does not support binary data");
    }

    let txt = data.toString('utf8');
    let msg;

    try {
        msg = JSON.parse(txt);
    } catch (e) {
        console.log(txt);
        return this.close(1011, "All messages must be valid utf8 JSON");
    }

    if (msg.type === "ping") {
        return this.send({type: 'pong'});
    }

    console.log(msg);
    let to = msg.to as PeerId | undefined;
    if (to === undefined) {
        return this.close(1011, "All messages must have a `to` field");
    }

    let target_socket = peers.get(to);
    if (!target_socket) {
        return this.send(JSON.stringify({type: "error-not-exists", destination: to}));
    }
    target_socket.send(JSON.stringify({...msg, from}));
}

console.log("Server listening on port 8080");
server.listen(process.argv[2]);
