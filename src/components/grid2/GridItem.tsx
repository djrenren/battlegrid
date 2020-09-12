import { Coord, Offset, GridSpace } from "../../modules/game/units";
import { PropsWithChildren, memo, forwardRef } from "react";
import React from "react";
import { motion } from "framer-motion";

export interface GridItemProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  loc: Coord<GridSpace>,
  dim: Offset<GridSpace>,
  style?: Omit<React.CSSProperties, 'position' | 'left' | 'top' | 'width' | 'height'>,
}

export const GridItem = memo(forwardRef((props: PropsWithChildren<GridItemProps>, ref) => {
  return (
    <motion.div
      {...props as any}
      ref={ref}
      style={{
        position: "absolute",
        ...props.style,
      }}
      initial={false}
      transition={{type: "tween", ease: "easeOut", duration: 0.2}}
      animate={{
        left: props.loc[0] + "em",
        top: props.loc[1] + "em",
        width: props.dim[0] + "em",
        height: props.dim[1] + "em",
      }}
      >
      {props.children}
    </motion.div>
  )
}));