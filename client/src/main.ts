/// <reference lib="DOM" />

import "./ui/viewport";
import "./ui/safari-fix";
import "./ui/canvas";
import "./ui/app";

await navigator.serviceWorker.register("./service-worker.js");

document.body.addEventListener(
  "wheel",
  (ev) => {
    console.log("HUH...");
    if (ev.ctrlKey) ev.preventDefault();
  },
  { passive: false }
);
