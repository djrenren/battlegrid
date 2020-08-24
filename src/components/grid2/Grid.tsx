import {
  PropsWithChildren,
} from "react";
import { Offset, Coord } from "./util";
import React from "react";
import { Overlay } from "./Overlay";
import "./grid.css";
import { Viewport, GridSpace } from "./Viewport";


export interface GridProps {
  dimensions: [number, number];
}

export function Grid(props: PropsWithChildren<GridProps>) {
    let dim = [30, 30] as Offset<GridSpace>;
    return (
        <Viewport
            baseScalar={1}
            baseUnit="in"
            dimensions={[30, 30] as Offset<GridSpace>}
        >
            {/* <Overlay height={dim[0]} width={dim[1]} /> */}
        </Viewport>
  );
}

export default Grid;
