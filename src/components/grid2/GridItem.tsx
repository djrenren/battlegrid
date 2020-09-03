import { GridSpace } from "./Viewport";
import { Coord, Offset } from "./util";
import { PropsWithChildren, memo } from "react";
import React from "react";

export interface GridItemProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  loc: Coord<GridSpace>,
  dim: Offset<GridSpace>,
  style?: Omit<React.CSSProperties, 'position' | 'left' | 'top' | 'width' | 'height'>,
}

export const GridItem = memo((props: PropsWithChildren<GridItemProps>) => {
  return (
    <div
      {...props}
      style={{
        position: "absolute",
        left: props.loc[0] + "em",
        top: props.loc[1] + "em",
        width: props.dim[0] + "em",
        height: props.dim[1] + "em",
        ...props.style,
      }}
      >
      {props.children}
    </div>
  )
});