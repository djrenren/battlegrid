import { EventStream } from "./eventstream";

describe(EventStream, () => {
  it("should work", async () => {
    let x = new EventTarget() as EventTarget & { addEventListener(ev: "foobar", cb: (_: CustomEvent) => void): void };
    let s = new EventStream<CustomEvent<string>>();
    s.set_src(x, "foobar");

    x.dispatchEvent(new CustomEvent("foobar", { detail: "baz" }));
    x.dispatchEvent(new CustomEvent("foobar", { detail: "bash" }));

    let ev = await s.next();
    expect(ev.detail).toBe("baz");
  });
});
