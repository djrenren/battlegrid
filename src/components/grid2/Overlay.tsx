import React from "react";

export function Overlay(props: {width: number, height: number}) {
    return (<>
         <defs>
            <pattern
              id="grid"
              width="1"
              height="1"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 1 0 L 0 0 0 1 1 1 1 0"
                fill="none"
                stroke="gray"
                strokeWidth="0.05"
              ></path>
            </pattern>
        </defs>
         <defs>
            <filter id="shadow">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="0.03"
                floodColor="blue"
                floodOpacity="0.8"
              />
              <feComposite operator="out" in2="SourceGraphic" />
            </filter>
            <pattern
              id="grid"
              width="1"
              height="1"
              patternUnits="userSpaceOnUse"
            >
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
            x="-0.5"
            y="-0.5"
            width={props.width}
            height={props.height}
            fill="url(#grid)"
          ></rect>
        </>
    )
}