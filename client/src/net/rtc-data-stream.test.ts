import "web-streams-polyfill";
import { read_stream } from "./rtc-data-stream";

describe("Data ReadableStream", () => {
  it("should allow iteration", async () => {
    let emitter = new EventTarget() as any;
    emitter.close = () => {};

    let stream = read_stream(emitter);

    let reader = stream.getReader();
    emitter.onmessage({ data: "hi" });

    expect((await reader.read()).value).toBe("hi");
  });

  it("should close gracefully", async () => {
    let emitter = new EventTarget() as any;
    emitter.close = () => {};
    let stream = read_stream(emitter);

    let reader = stream.getReader();
    emitter.onmessage({ data: "hi" });
    emitter.dispatchEvent(new CustomEvent("close"));

    expect((await reader.read()).value).toBe("hi");
    expect((await reader.read()).done).toBe(true);
  });
});
