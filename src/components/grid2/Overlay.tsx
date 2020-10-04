import React from "react";
import { Coord, GridSpace } from "../../modules/game/units";

export interface OverlayProps {
  width: number;
  height: number;
  onDrop?: (coord: Coord<GridSpace>) => void;
}

const thickness = 0.05;
const linecolor = "gray";
function Overlay(props: OverlayProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${-thickness / 2}em`,
        right: `${-thickness / 2}em`,
        top: `${-thickness / 2}em`,
        bottom: `${-thickness / 2}em`,
        background: `
      repeating-linear-gradient(to right, ${linecolor}, ${linecolor} ${thickness}em, transparent ${thickness}em 1em),
      repeating-linear-gradient(to bottom, ${linecolor}, ${linecolor} ${thickness}em, transparent ${thickness}em 1em)`,
        pointerEvents: "none",
        borderRight: `${thickness}em solid ${linecolor}`,
        borderBottom: `${thickness}em solid ${linecolor}`,
        transition: "position 2s",
      }}
    ></div>
  );
}
export default React.memo(Overlay);
