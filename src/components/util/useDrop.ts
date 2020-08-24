import { useState, useEffect } from "react";

export default function useDrop(
  ref: React.RefObject<HTMLElement | null>,
  onDrop: (ev: DragEvent) => void
): [boolean, any] {
  let [dragDepth, setDragDepth] = useState(0);
    const dropStub = (ev: DragEvent) => {
        ev.preventDefault();
        setDragDepth((d) => d - 1);
        onDrop(ev);
    };
    const onDragEnter = (ev: DragEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      setDragDepth((d) => d + 1);
    };
    const onDragLeave = (ev: DragEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      setDragDepth((d) => d - 1);
    };
    const onDragOver = (ev: DragEvent) => {
      ev.preventDefault();
    };
    return [dragDepth > 0, {
        onDragEnter,
        onDragLeave,
        onDragOver,
        onDrop: dropStub,
    }]
}
