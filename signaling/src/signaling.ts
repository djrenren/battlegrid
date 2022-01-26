import { type RawData, WebSocket, WebSocketServer } from 'ws';
import * as uuid from 'uuid';
import { type IncomingMessage, createServer } from 'http';
import { Socket } from 'dgram';


type PeerId = string & {__brand: 'peer_id'};

let peers = new Map<PeerId, WebSocket>();
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

server.on('upgrade', (req, socket, head) => {
    let suggested_id = get_suggested_id(req);

    console.log(suggested_id)

    if (suggested_id && peers.has(suggested_id)) {
        return socket.end('HTTP/1.1 409 Conflict\r\n\r\n');
    }

    let id = suggested_id ?? uuid.v4() as PeerId;


    wss.handleUpgrade(req, socket, head, (socket) => {
        peers.set(id, socket);
        console.log(id, "connected");
        socket.send(JSON.stringify({type: "assignment", id}));
        socket.on('message', (data, isBinary) => {
            on_message.bind(socket)(id, data, isBinary);
        });
        socket.on('close', () => peers.delete(id));
    });
})


function on_message(this: WebSocket, from: string, data: RawData, isBinary: boolean) {
    if (isBinary) {
        return this.close(400, "Signaling server does not support binary data");
    }

    let msg;

    try {
        msg = JSON.parse(data.toString('utf8'));
    } catch (e) {
        return this.close(400, "All messages must be valid utf8 JSON");
    }
    console.log(msg);

    let target = msg.target as PeerId | undefined;
    if (target === undefined) {
        return this.close(400, "All messages must have a target");
    }

    let target_socket = peers.get(target);
    if (!target_socket) {
        return this.send(JSON.stringify({error: "target-not-exists", target}));
    }
    target_socket.send(JSON.stringify({...msg, from}));
}

console.log("Server listening on port 8080");
server.listen(8080);
