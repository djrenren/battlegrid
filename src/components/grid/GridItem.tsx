import { PropsWithChildren } from "react";
import React from "react";

export interface GridItemProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  href: string;
  onClick?: () => void;
}

export function GridItem(props: PropsWithChildren<GridItemProps>) {
    return (
      <image
            key={props.id}
            href={props.href}
            x={props.x + 0.05}
            y={props.y + 0.05}
            width={props.width - 0.1}
            height={props.height - 0.1}
            onClick={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();    
                props.onClick && props.onClick();
            }}
      ></image>
  );
}
