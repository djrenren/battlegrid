import { useState, useEffect } from "react";
export interface DragState {
  x: number,
  y: number,
}

export default function useDrop(
  ref: React.RefObject<Element | null>,
  onDrop: (ev: DragEvent) => void
): [boolean, DragState, any] {
  let [dragDepth, setDragDepth] = useState(0);
  let [dragState, setDragState] = useState({
    x: 0,
    y: 0,
  });
  console.log(dragDepth)
  const dropStub = (ev: DragEvent) => {
    ev.preventDefault();
    let [x, y] = [ev.clientX, ev.clientY];
    setDragDepth(0);
    setDragState({
      x,
      y,
    });
    onDrop(ev);
  };
  const onDragEnter = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    let [x, y] = [ev.clientX, ev.clientY];
    setDragDepth(d => d + 1);
    setDragState({
      x,
      y,
    });
  };
  const onDragLeave = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    let [x, y] = [ev.clientX, ev.clientY];
    setDragDepth(d => d - 1);
    setDragState({
      x,
      y,
    });
    };
  const onDragOver = (ev: DragEvent) => {
    ev.preventDefault();
    let [x, y] = [ev.clientX, ev.clientY];
    setDragState({
      x,
      y,
    });
    };
    return [dragDepth > 0, dragState, {
        onDragEnter,
        onDragLeave,
        onDragOver,
        onDrop: dropStub,
    }]
}
