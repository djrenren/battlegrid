import {
  PropsWithChildren, useRef,
} from "react";
import { Offset, Coord } from "./util";
import React from "react";
import Overlay  from "./Overlay";
import "./grid.css";
import { Viewport, GridSpace, ViewportRef } from "./Viewport";
import useDrop from "../util/useDrop";


export interface GridProps {
  dimensions: [number, number];
}

export function Grid(props: PropsWithChildren<GridProps>) {
  let dropLayer = useRef<HTMLDivElement>(null);
  let viewport = useRef<ViewportRef>(null);
  let [dragging, drag, dragHandlers] = useDrop(dropLayer, () => { });
  let gridDrag: Coord<GridSpace>;
  if (dragging) {
    gridDrag = viewport.current!.clientToGrid([drag.x, drag.y]);
  }
  return (
    <div className="grid" {...dragHandlers} ref={dropLayer}>
      <Viewport
        ref={viewport}
            baseScalar={1}
        baseUnit="in"
        width={props.dimensions[0]}
        height={props.dimensions[1]}
        >
        {dragging ? <rect
          x={Math.floor(gridDrag![0])} 
          y={Math.floor(gridDrag![1])} 
          width="1"
          height="1"
          fill="#aaa"
        ></rect> : null}
        <Overlay height={props.dimensions[1]} width={props.dimensions[0]} />
    
      </Viewport>
      </div>
  );
}

export default Grid;
