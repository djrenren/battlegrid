import { DurableSignaler } from "./net/signaling";
import "./ui/viewport";
import "./ui/safari-fix";
import "./ui/canvas";
import "./ui/app";

document.body.addEventListener(
  "wheel",
  (ev) => {
    console.log("HUH...");
    if (ev.ctrlKey) ev.preventDefault();
  },
  { passive: false }
);
