import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  PropsWithChildren,
  useCallback,
} from "react";
import "./Grid.css";
import { zoom } from "../../redux/modules/grid";
import { useNavigation } from "./navigation";

interface GridProps {
  dimX: number;
  dimY: number;
}



function Grid(props: PropsWithChildren<GridProps>) {
  let ref = useRef<HTMLDivElement>(null);
  let svgRef = useRef<SVGSVGElement>(null);

  useNavigation(ref, svgRef, props.dimX, props.dimY);
  

  return (
    <div className="full-height-container">
      <div className="grid full-height-container" ref={ref}>
        <svg
          viewBox={`0 0 ${props.dimX} ${props.dimY}`}
          xmlns="http://www.w3.org/2000/svg"
          className="gridsvg"
          style={{
            display: "block",
            //transition: "all 0.01s",
            //transitionTimingFunction: "ease-out",
            background: "white",
            overflow: "hidden",
          }}
          ref={svgRef}
          overflow="hidden"
        >
          <defs>
            <pattern
              id="grid"
              width="1"
              height="1"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 1 0 L 0 0 0 1"
                fill="none"
                stroke="gray"
                strokeWidth="0.1"
              ></path>
            </pattern>
          </defs>
          <rect
            style={{
              resize: "both",
              overflow: "auto",
            }}
            x=".1"
            y=".1"
            width={props.dimX - 1}
            height={props.dimY - 1}
            fill="url(#grid)"
          ></rect>
          {props.children}
        </svg>
      </div>
    </div>
  );
}

export default Grid;
