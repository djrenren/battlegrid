/// @ts-ignore
import * as WebRTC from "wrtc";
import { webcrypto } from "node:crypto";
globalThis.crypto = webcrypto as any;
for (var member in WebRTC) {
  /// @ts-ignore
  globalThis[member] = WebRTC[member];
}

import "web-streams-polyfill";
import "abortcontroller-polyfill";
import { Signaler } from "./signaler";
import { PeerId } from "./peer";
import { open } from "../util/rtc";
import { waitFor } from "../util/events";

/**
 * @jest-environment jsdom
 */

describe(Signaler, () => {
  it("negotiates a connection", async () => {
    let [x, y] = [new Signaler("1" as PeerId, true, "ws://localhost:8081"), new Signaler("2" as PeerId, true, "ws://localhost:8081")];

    let peer = await x.initiate(y.peer_id);

    await open(peer.rtc);

    let close = waitFor("close", peer.events_dc);
    peer.rtc.close();
    await close;
  });
});
