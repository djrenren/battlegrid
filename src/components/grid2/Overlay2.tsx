import React from "react";
import { GridSpace } from "./Viewport";
import { Coord } from "./util";

export interface OverlayProps {
  width: number,
  height: number,
  onDrop?: (coord: Coord<GridSpace>) => void;
}

const thickness = "1px"
function Overlay2(props: OverlayProps) {
  return (<div style={{
    position: "absolute",
    left: "0",
    top: "0",
    width: props.width + 'em',
    height: props.height + 'em',
    backgroundPosition: "top left",
    background: `repeating-linear-gradient(to right, grey, grey ${thickness}, transparent ${thickness} 1em), repeating-linear-gradient(to bottom, grey, grey ${thickness}, transparent ${thickness} 1em)`,
    pointerEvents: "none",
  }}></div>
  );
}
export default React.memo(Overlay2);