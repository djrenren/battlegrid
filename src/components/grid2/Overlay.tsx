import React from "react";
import { Coord, GridSpace } from "../../modules/game/units";

export interface OverlayProps {
  width: number;
  height: number;
  onDrop?: (coord: Coord<GridSpace>) => void;
}

const thickness = 0.025;
function Overlay(props: OverlayProps) {
  return (
      <svg viewBox={`0 0 ${props.width + thickness} ${props.height + thickness}`} style={{
      position: "absolute",
        left: `${-thickness / 2}em`,
        top: `${-thickness / 2}em`,
        width: `${props.width + thickness}em`,
        height: `${props.height + thickness}em`,
        pointerEvents: "none",
        transition: "position 2s",
      }}>
        <defs>
            <pattern
              id="grid"
              width="1"
              height="1"
              patternUnits="userSpaceOnUse"
              shapeRendering="geometricPrecision"
            >
              <path
                d="M 1 0 L 0 0 0 1"
                fill="none"
                stroke="gray"
                strokeWidth={thickness * 2}
              ></path>
            </pattern>
        </defs>
        <rect
            style={{
              pointerEvents: "none",
          }}
          x={0}
          y={0}
            width={props.width + thickness}
            height={props.height + thickness}
            fill="url(#grid)"
          ></rect>
        </svg>
  );
}
export default React.memo(Overlay);
