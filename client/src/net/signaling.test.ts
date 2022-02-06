/// @ts-ignore
import * as WebRTC from "wrtc";
for (var member in WebRTC) {
  /// @ts-ignore
  globalThis[member] = WebRTC[member];
}

import { DurableSignaler } from "./signaling";
/**
 * @jest-environment jsdom
 */

describe(DurableSignaler, () => {
  it("notifies when disconnected", async () => {
    let x = await DurableSignaler.establish(new URL("ws://localhost:8080"));

    return new Promise((resolve, reject) => {
      x.addEventListener("status", (ev) => {
        try {
          expect(ev.detail).toBe("disconnected");
        } catch (e) {
          reject(e);
        }
        resolve(null);
      });

      x._disconnect();
    });
  });

  it("reconnects after loss", async () => {
    let x = await DurableSignaler.establish(new URL("ws://localhost:8080/"));

    return new Promise((resolve, reject) => {
      x.addEventListener("status", ({ detail: status }) => {
        if (status === "connected") {
          resolve(null);
        }
      });

      x._disconnect();
    });
  });

  it("notifies on close", async () => {
    let x = await DurableSignaler.establish(new URL("ws://localhost:8080/"));

    return new Promise((resolve, reject) => {
      x.addEventListener("status", ({ detail: status }) => {
        if (status === "closed") {
          resolve(null);
        }
      });

      x.close();
    });
  });

  it("supports suggested ids", async () => {
    let ident = "h4x0rz";
    let x = await DurableSignaler.establish(new URL("ws://localhost:8080"), ident);

    expect(x.ident).toBe(ident);
  });

  it("does not allow duplicate ids", async () => {
    expect.assertions(1);

    let ident = "duping";
    let x = await DurableSignaler.establish(new URL("ws://localhost:8080"), ident);

    await expect(DurableSignaler.establish(new URL("ws://localhost:8080"), ident)).rejects.toBeInstanceOf(CloseEvent);
  });
});
