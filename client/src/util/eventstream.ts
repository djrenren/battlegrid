export class EventStream<T> implements AsyncIterable<T> {
  #queue: T[] = [];
  #src?: EventTarget;
  #ev?: string;
  #resolve?: (_: any) => void;
  #reject?: (_: any) => void;
  #canceled = false;
  constructor() {}

  set_src<E extends string, U extends EventTarget & { addEventListener: (ev: E, cb: (ev: T) => void) => void }>(ev: E, src: U) {
    this.#src?.removeEventListener(this.#ev!, this.#fwd as any);
    src.addEventListener(ev, this.#fwd);
    this.#src = src;
    this.#ev = ev;
  }

  #fwd = (ev: T) => {
    this.#queue.push(ev);
    this.#resolve && this.#resolve(null);
  };

  async next(): Promise<T> {
    if (this.#queue.length === 0) {
      await new Promise((resolve, reject) => {
        this.#resolve = resolve;
        this.#reject = reject;
      });
    }

    return this.#queue.shift()!;
  }

  close() {
    this.#canceled = true;
    this.#reject && this.#reject(null);
  }

  async *[Symbol.asyncIterator]() {
    while (!this.#canceled) {
      try {
        yield await this.next();
      } catch {}
    }
  }
}
