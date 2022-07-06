/**
 * @jest-environment jsdom
 */
import "web-streams-polyfill";
import { durable } from "./streams";

describe(durable, () => {
  it("successfully resumes on underlying close", async () => {
    let destroy: () => Promise<void>;
    let builder = async () => {
      let read_controller: ReadableStreamController<any>, write_controller: WritableStreamDefaultController;
      let readable = new ReadableStream({
        start(controller) {
          read_controller = controller;
        },
      });

      let writable = new WritableStream({
        start(controller) {
          write_controller = controller;
        },

        async write(chunk) {
          read_controller.enqueue(chunk);
        },
      });
      destroy = async () => {
        read_controller.close();
        write_controller.error();
      };

      return { readable, writable };
    };

    console.log("MAKING DURABLE");
    let d = await durable(builder);
    console.log("now what...");
    let d_out = d.readable.getReader();
    let d_in = d.writable.getWriter();

    await d_in.write("Hi");
    expect((await d_out.read()).value).toBe("Hi");

    await destroy!();

    await d_in.write("there");
    expect((await d_out.read()).value).toBe("there");
  });

  it("should close underlying stream when the durable stream is closed", async () => {
    let underlying: TransformStream | undefined;
    let cancel = jest.fn();
    let abort = jest.fn();

    let builder = async () => ({
      readable: new ReadableStream({ cancel }),
      writable: new WritableStream({ abort }),
    });

    let d = await durable(builder);

    console.log("canceling");
    await d.readable.cancel();
    console.log("closing");
    await d.writable.abort();
    console.log("expecting");
    expect(abort).toBeCalledTimes(1);
    expect(cancel).toBeCalledTimes(1);
  });
});
