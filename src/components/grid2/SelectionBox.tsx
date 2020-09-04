import { ClientSpace } from "./Viewport";
import { Coord, coord } from "./util";
import { useRef, useCallback } from "react";
import { GridItemProps, GridItem } from "./GridItem";
import React, {PointerEvent} from "react";

interface SelectionProps extends GridItemProps {
  onSelectionDrag: (offset: Coord<ClientSpace>) => void,
  onSelectionDrop: (offset: Coord<ClientSpace>) => void,
}

function SelectionBox(props: SelectionProps) {
  const initialLoc = useRef<Coord<ClientSpace> | null>(null)
  // Represents the distance in client pixels from selection element origin to click point
  const onPointerMove = useCallback((ev: PointerEvent<HTMLElement>) => {
      if (initialLoc.current) {
          ev.preventDefault();
          ev.stopPropagation();
          
          props.onSelectionDrag(coord(ev));
      }
  }, [props])
  const onPointerUp = useCallback((ev) => {
      if (initialLoc.current !== null) {
          ev.preventDefault();
        ev.stopPropagation();
        ;
          //(ev.currentTarget as HTMLDivElement).releasePointerCapture(ev.pointerId);
          props.onSelectionDrop(coord(ev));
        initialLoc.current = null;
      }
  }, [props])
  return (
    <GridItem
      loc={props.loc} 
      dim={props.dim}
      style={{
        border: "2px solid buttonFace",
        boxShadow: "0 0 10px buttonFace"
      }}
      onPointerDown={ev => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    
        ev.currentTarget.setPointerCapture(ev.pointerId);
        initialLoc.current = coord(ev);
      }}
      onPointerMoveCapture={onPointerMove}
      onPointerUpCapture={onPointerUp}
    ></GridItem>
  )
}

export default SelectionBox;