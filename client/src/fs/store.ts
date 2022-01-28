type Resource = {
  url: string | null;
  subscribers: Set<(_: string) => void>;
};

let resources: Map<string, Resource> = new Map();

export const subscribe = (resource_id: string, cb: (url: string) => void) => {
  let resource = resources.get(resource_id);
  if (!resource) {
    resources.set(resource_id, { url: null, subscribers: new Set([cb]) });
    fetch_resource(resource_id);
  } else {
    resource.subscribers.add(cb);
  }
};

export const unsubscribe = (
  resource_id: string,
  cb: (url: string) => void
) => {};

export const register = async (name: string, data: Blob) => {
  let url = URL.createObjectURL(data);
  console.log("awaiting...");
  let sw = await window.navigator.serviceWorker.ready;
  console.log(sw.active);
  // window.navigator.serviceWorker.controller?.postMessage({type: 'register', name, data});
  sw.active?.postMessage({ type: "register", name, data });

  setTimeout(() => {
    for (let el of document.querySelectorAll(`img[src^='/fs/${name}']`)) {
      (el as HTMLImageElement).src = `/fs/${name}?${Date.now()}`;
    }
  }, 1000);
};

const fetch_resource = (id: string) => {
  console.log("fetching");
  if (id === "test") {
    setTimeout(async () => {
      var url =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

      let res = await fetch(url);
      let blob = await res.blob();
      let obj = URL.createObjectURL(blob);

      resources.get(id)!.url = obj;

      resources.get(id)!.subscribers.forEach((f) => f(obj));
    }, 3000);
  }
};
