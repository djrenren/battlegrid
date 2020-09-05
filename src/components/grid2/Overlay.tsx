import React from "react";
import { Coord, GridSpace } from "../../modules/grid/units";

export interface OverlayProps {
  width: number,
  height: number,
  onDrop?: (coord: Coord<GridSpace>) => void;
}

const thickness = 0.05
const linecolor = "gray"
function Overlay(props: OverlayProps) {
  return (<div style={{
    position: "absolute",
    left: `${-thickness/2}em`,
    right: `${-thickness/2}em`,
    top: `${-thickness/2}em`,
    bottom: `${-thickness/2}em`,
    // width: props.width + 'em',
    // height: props.height + 'em',
    background: `
      repeating-linear-gradient(to right, ${linecolor}, ${linecolor} ${thickness}em, transparent ${thickness}em 1em),
      repeating-linear-gradient(to bottom, ${linecolor}, ${linecolor} ${thickness}em, transparent ${thickness}em 1em)`,
      // repeating-linear-gradient(to right, ${linecolor}, ${linecolor} ${thickness / 2}em, transparent ${thickness / 2}em ${1 - thickness / 2}em, ${linecolor} ${1 - thickness / 2}em 1em),
      // repeating-linear-gradient(to bottom, ${linecolor}, ${linecolor} ${thickness / 2}em, transparent ${thickness / 2}em ${1 - thickness / 2}em, ${linecolor} ${1 - thickness / 2}em 1em)`,
    pointerEvents: "none",
    border: `${thickness/2} solid ${linecolor}`
    
  }}></div>
  );
}
export default React.memo(Overlay);