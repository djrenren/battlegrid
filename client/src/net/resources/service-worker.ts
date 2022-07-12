/// <reference no-default-lib="true"/>
/// <reference lib="es2020" />
/// <reference lib="WebWorker" />

import { CachedKeyDecoder } from "@msgpack/msgpack/dist/CachedKeyDecoder";
import { timeout } from "../../util/promises";
import { ResourceMessage } from "./service-worker-protocol";

type ResourceId = string;

const sw = self as ServiceWorkerGlobalScope & typeof globalThis;

let pending = new Map<
  ResourceId,
  {
    resolve: () => void;
    reject: (err: any) => void;
    promise: Promise<void>;
  }
>();

let cache: Cache;

sw.addEventListener("install", (ev) => {
  console.log("installing");
});

sw.addEventListener("message", (ev: ExtendableMessageEvent) => {
  ev.waitUntil(
    (async () => {
      let cache = caches.open("resources");
      let data = ev.data as ResourceMessage;
      switch (data.type) {
        case "found":
          let r = new Response(data.blob);
          await (await cache).put(`/resources/${data.id}`, r);
          pending.get(data.id)?.resolve();
          break;
        case "notfound":
          pending.get(data.id)?.reject(data.error);
      }
    })()
  );
});

sw.addEventListener("activate", (ev) => {
  console.log("activate");
  ev.waitUntil(
    (async () => {
      cache = await caches.open("resources");
      await sw.clients.claim();
      console.log("claimed clients");
    })()
  );
});

function which_resource(url: string): ResourceId | null {
  let segs = new URL(url).pathname.split("/");
  if (segs.length !== 3 && segs[1] != "resources") {
    return null;
  }

  return segs[2] as ResourceId;
}

async function fetch_resource(ev: FetchEvent): Promise<Response> {
  const request = ev.request;
  const resource = which_resource(request.url);
  console.log("TRYING TO FETCH", request.url, resource);
  if (!resource) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  let promise = pending.get(resource)?.promise;

  // request is not pending
  if (!promise) {
    console.log("Request is not pending");
    let resolve: () => void;
    let reject: (err: any) => void;
    promise = new Promise<void>((a, b) => {
      resolve = a;
      reject = b;
    });

    pending.set(resource, {
      resolve: () => {
        console.log("RESOLVE");
        pending.delete(resource);
        resolve();
      },
      reject: (err: any) => {
        console.log("REJECT");
        pending.delete(resource);
        reject(err);
      },
      promise,
    });

    let cached = await caches.match(ev.request);
    if (cached) {
      console.log("request is cached");
      resolve!();
      return cached;
    } else {
      console.log("request is not cached");
      const c = await sw.clients.get(ev.clientId);
      if (!c) {
        reject!("client does not exist");
      } else {
        console.log("forwarding request to client");
        c.postMessage({ id: resource });
      }
    }
  }

  let res = await promise.then(() => caches.match(ev.request)).catch((err) => new Response(err, { status: 500, statusText: "Internal Error" }));

  return (
    res ||
    new Response(null, {
      status: 404,
      statusText: "Not found",
    })
  );
}

sw.addEventListener("fetch", (ev) => {
  let url = new URL(ev.request.url);
  if (!url.pathname.startsWith("/resources/")) {
    return false;
  }
  ev.respondWith(
    (async () => {
      console.log(ev.request.headers)
      console.log("RESPONDING");
      return fetch_resource(ev);
    })()
  );
});
