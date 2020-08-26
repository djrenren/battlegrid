import React, { useRef } from "react";
import useDrop from "../util/useDrop";
import { GridSpace } from "./Viewport";
import { Coord } from "./util";

export interface OverlayProps {
  width: number,
  height: number,
  onDrop?: (coord: Coord<GridSpace>) => void;
}


function Overlay(props: { width: number; height: number }) {
  return (
    <>
      <defs>
        <pattern id="grid" width="1" height="1" patternUnits="userSpaceOnUse">
          <path
            d="M 1 0 L 0 0 0 1 1 1 1 0"
            fill="none"
            stroke="gray"
            strokeWidth="0.05"
          ></path>
        </pattern>
      </defs>
      <rect
        style={{
          pointerEvents: "none",
        }}
        x="0"
        y="0"
        width={props.width}
        height={props.height}
        fill="url(#grid)"
      ></rect>
    </>
  );
}
export default React.memo(Overlay);