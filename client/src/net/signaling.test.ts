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
import { Signaler } from "./signaling";
import { hasUncaughtExceptionCaptureCallback } from "node:process";

/**
 * @jest-environment jsdom
 */

describe(Signaler, () => {
  it("negotiates a connection", async () => {
    let [x, y] = await Promise.all([Signaler.establish(new URL("ws://localhost:8080")), Signaler.establish(new URL("ws://localhost:8080"))]);

    let peer = await x.initiate(y.peer_id);

    expect(peer.rtc.iceConnectionState).toBe("connected");
  });
});
