import { type LitElement } from "lit";
import { state } from "lit/decorators.js";
import { type Point } from "../../util/math";
import type { Constructor } from "./mixins";

interface DragAndDropInterface {
  drag_location?: Point;
}

export const DragAndDropMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  //@ts-ignore
  class DragAndDropper extends superClass {
    @state()
    drag_location?: Point;

    connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener("dragenter", this.#dragover);
      this.addEventListener("dragover", this.#dragover);
      this.addEventListener("drop", this.#drop);
      this.addEventListener("dragleave", this.#drop);
    }

    disconnectedCallback(): void {
      this.addEventListener("dragenter", this.#dragover);
      this.removeEventListener("dragover", this.#dragover);
      this.removeEventListener("dragleave", this.#drop);
      this.removeEventListener("drop", this.#drop);
    }

    #dragover = (ev: DragEvent) => {
      this.drag_location = [ev.offsetX, ev.offsetY];
      ev.preventDefault();
    };

    #drop = (ev: DragEvent) => {
      this.drag_location = undefined;
    };
  }

  return DragAndDropper as Constructor<DragAndDropInterface> & T;
};
