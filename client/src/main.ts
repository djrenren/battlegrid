/// <reference lib="DOM" />

import "./ui/safari-fix";
import "./ui/canvas";
import "./ui/app";
import "./ui/app";
import "./ui/ppp";

await navigator.serviceWorker.register("./service-worker.js");

document.body.addEventListener(
  "wheel",
  (ev) => {
    if (ev.ctrlKey) ev.preventDefault();
  },
  { passive: false }
);
