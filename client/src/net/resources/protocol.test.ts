/**
 * @jest-environment jsdom
 */

import { pipe } from "../../util/streams";
import { request, response } from "../resources";
import "blob-polyfill";
import "web-streams-polyfill/es2018";

describe("Resources Protocol", () => {
  it("can send a file", async () => {
    let [client, server] = pipe<ArrayBuffer>();
    let blob = new Blob(["Hello world!"]);

    let result = request(client);
    let receiver = response(server, {
      data: blob,
    });

    let [resource] = await Promise.all([result, receiver]);
    console.error(resource);
    expect(await resource.data.text()).toBe("Hello world!");
  });
});
