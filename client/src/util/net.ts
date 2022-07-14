import { Observable } from "lib0/observable";
import { EventEmitter, waitFor } from "./events";

export type Status = "open" | "closed" | "opening";

export type HasStatus = { status: Status } & EventEmitter<{
  status: CustomEvent<Status>;
}>;

export function connected(i: HasStatus): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let handler = ({ detail: status }: { detail: Status }) => {
      status === "open" && resolve();
      status === "closed" && reject();
      i.removeEventListener("status", handler);
    };
    i.addEventListener("status", handler);
    handler({ detail: i.status });
  });
}

export class StatusEmitter extends Observable<"status"> {
  #value: Status = "opening";
  get current() {
    return this.#value;
  }

  set(s: Status) {
    let should_emit = this.#value !== s;
    this.#value = s;
    if (should_emit) this.emit("status", []);
  }

  connected(): Promise<void> {
    return new Promise((resolve, reject) => {
      let complete = () => {
        if (this.#value === "closed") reject("closed");
        if (this.#value === "open") resolve();
      };
      if (this.#value === "opening") {
        this.once("status", complete);
      } else {
        complete();
      }
    });
  }
}
