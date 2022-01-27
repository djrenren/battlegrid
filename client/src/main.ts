import { DurableSignaler } from "./net/signaling";
import "./ui/viewport";
import "./ui/safari-fix";
import "./ui/grid/gridlines";
import "./ui/token";


document.body.addEventListener(
  "wheel",
  (ev) => {
    if (ev.ctrlKey) ev.preventDefault();
  },
  { passive: false }
);


// (async function () {
//   let signaler = await DurableSignaler.establish(
//     new URL("ws://localhost:8080")
//   );
//   signaler.addEventListener("peer", ({ detail: peer }) => {
//     peer.send("control", "hello");
//     peer.on_data = console.log.bind(console);
//   });

//   let target = window.location.hash.substring(1);
//   if (target) {
//     let peer = await signaler.connect_to(target);
//     peer.on_data = console.log.bind(console);
//   } else {
//     location.hash = signaler.ident;
//   }
// })();
