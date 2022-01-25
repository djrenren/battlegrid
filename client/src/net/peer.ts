import { DurableSignaler } from "./signaling";
/// @ts-ignore
import { RTCPeerConnection, RTCSessionDescription } from "wrtc";

export class PeerConnection{}

export class Peer extends EventTarget {
    signaler: DurableSignaler;
    peers: Map<string, {timeout: number, resolve: any, reject: any, conn: RTCPeerConnection}> = new Map();

    private constructor(signaler: DurableSignaler)  {
        super();
        this.signaler = signaler;
    }

    static async establish(): Promise<Peer> {
        let peer = new Peer(await DurableSignaler.establish(new URL("ws://localhost:8080")));
        peer.signaler.addEventListener('message', ({detail: msg}) => peer.#handle_message(msg));
        peer.signaler.addEventListener('error', ({detail: err}) => console.log("DSFLKJSDF:LJSD:LFJDS:F", err))
        return peer;
    }

    get configuration() {
        return {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
    }

    #createPeer(remote_peer: string, timeout?: number): Promise<RTCPeerConnection> {
        if (this.peers.has(remote_peer)) {
            this.peers.get(remote_peer)?.reject();
        }

        let conn = new RTCPeerConnection(this.configuration)
        conn.onicecandidate = ({candidate}: {candidate: any}) => {

            if (conn.signalingState !== 'closed' && candidate) {
                this.signaler.send(remote_peer, {
                    type: "icecandidate",
                    candidate
                })
            }
        };

        conn.onsignalingstatechange =  () => {
            if (conn.signalingState === 'closed') {
                conn.onconnectionstatechange = null;
                conn.onicecandidate = null;
                conn.signalingstatechange = null;
                this.peers.delete(remote_peer);
            }
        };

        conn.onconnectionstatechange = () => {
            if(conn.connectionState === 'connected') {
                this.peers.get(remote_peer)?.resolve();
            }
        };

        return new Promise((resolve: (_: RTCPeerConnection) => void, reject) => {
            let t_id = setTimeout(() => {
                this.signaler.send(remote_peer, {
                    "type": "abort",
                    "reason": "timeout"
                });
                console.log("TIMEDOUT!");
                this.#close_peer(remote_peer);
                reject("timed out");
            }, timeout ?? 5000);

            const wrapped_resolve = () => {
                clearTimeout(t_id);
                this.peers.delete(remote_peer);
                resolve(conn)
            };

            const wrapped_reject = (...args: any) => {
                clearTimeout(t_id);
                this.#close_peer(remote_peer);
                reject(...args);
            }

            this.peers.set(remote_peer, {timeout: t_id, resolve: wrapped_resolve, reject: wrapped_reject, conn});
        })
    }

    async connect_to(remote_peer: string, timeout?: number): Promise<RTCPeerConnection> {
        let peer = this.#createPeer(remote_peer, timeout);

        let conn = this.peers.get(remote_peer)!.conn;
        conn.createDataChannel("coord");
        const offer = await this.peers.get(remote_peer)!.conn.createOffer();
        await conn.setLocalDescription(offer);
        this.signaler.send(remote_peer, {type: 'offer', offer});

        return peer;
    }

    async #handle_message(data: any) {
        let from: string = data.from;

        switch (data.type) {
            case "offer":

                this.#createPeer(from).then((peer) => {
                    this.dispatchEvent(new CustomEvent('peer', {detail: peer}));
                }).catch(() => {
                    // we ignore these errors because no one is observing them
                });
                let conn = this.peers.get(from)!.conn;
                try {
                conn.setRemoteDescription(new RTCSessionDescription(data.offer));
                } catch (e) {
                    console.error(e);
                }

                const answer = await conn.createAnswer();
                if (conn.signalingState === 'closed') {
                    break;
                }
                await conn.setLocalDescription(answer);
                if (conn.signalingState === 'closed') {
                    break;
                }

                this.signaler.send(from, {
                    type: 'answer',
                    answer
                });
                break;

            case "answer":

                if (!this.peers.has(from)) {
                    break;
                }

                let peer = this.peers.get(from)!;
                try {
                    peer.conn.setRemoteDescription(new RTCSessionDescription(data.answer));

                } catch(e) {
                    console.log(e);
                }


                break;

            case "icecandidate":
                if (!this.peers.has(from)) {
                    // console.error("icecandidate from non-existent peer. Maybe negotiation timed out?")
                    break;
                }

                try {
                    await this.peers.get(from)!.conn.addIceCandidate(data.candidate);
                } catch (e) {
                    //console.error('Error adding received ice candidate', e);
                }
                break;

            case "abort":
                console.debug("Aborting negotiation with ", from);
                this.peers.get(from)?.reject("Remotely aborted");
                this.peers.delete(from);
        }
    }

    #close_peer(remote_peer: string) {
        this.peers.get(remote_peer)?.conn.close();
        this.peers.delete(remote_peer);
    }

    close() {
        for (let peer of this.peers.values()) {
            peer.conn.close();
            peer.reject("Manual shutdown");
        }
        this.signaler.close();
    }
}

export interface Peer {
    addEventListener(type: 'peer', callback: (msg: CustomEvent<RTCPeerConnection>) => void, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListener | EventListenerObject, useCapture?: boolean): void;
}