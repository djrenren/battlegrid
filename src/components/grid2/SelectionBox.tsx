import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { ClientSpace, Coord, coord } from "../../modules/game/units";
import { GridItem, GridItemProps } from "./GridItem";

interface SelectionProps extends GridItemProps {
  onSelectionDrag: (offset: Coord<ClientSpace>) => void;
  onSelectionDrop: (offset: Coord<ClientSpace>) => void;
}

const handleSize = 10; //px

function SelectionBox(props: SelectionProps) {
  const { onSelectionDrag, onSelectionDrop } = props;
  const initialLoc = useRef<Coord<ClientSpace> | null>(null);
  // Represents the distance in client pixels from selection element origin to click point
  const onPointerMove = useCallback(
    (ev: PointerEvent) => {
      if (!ev.isPrimary || ev.buttons !== 1) {
        return;
      }
      if (!initialLoc.current) {
        initialLoc.current = coord(ev);
        (ev.target as any).setPointerCapture(ev.pointerId);
      }
      //ev.preventDefault();
      ev.stopPropagation();

      onSelectionDrag(coord(ev));
    },
    [onSelectionDrag]
  );
  const onPointerUp = useCallback(
    (ev: PointerEvent) => {
      if (initialLoc.current !== null) {
        ev.preventDefault();
        ev.stopPropagation();
        onSelectionDrop(coord(ev));
        initialLoc.current = null;
      }
    },
    [onSelectionDrop]
  );

  const itemRef = useRef<HTMLDivElement>();
  useEffect(() => {
    itemRef.current?.addEventListener(
      "touchmove",
      (ev) => ev.preventDefault(),
      { passive: false }
    );
  }, []);
  useLayoutEffect(() => {
    const item = itemRef.current!;
    const capture = true;
    const preventDefault = (ev: any) => ev.preventDefault();
    item.addEventListener("pointerdown", preventDefault, { capture });
    item.addEventListener("pointermove", onPointerMove, { capture });
    item.addEventListener("pointerup", onPointerUp, { capture });
    return () => {
      item.removeEventListener("pointerdown", preventDefault, {capture});
      item.removeEventListener("pointermove", onPointerMove, {capture});
      item.removeEventListener("pointerup", onPointerUp, {capture});
    };
  }, [onPointerMove, onPointerUp]);
  return (
    <GridItem
      ref={itemRef}
      loc={props.loc}
      dim={props.dim}
      style={{
        border: "2px solid blue",
        boxShadow: "0 0 4px blue",
        overflow: "visible",
      }}
    >
      <div
        className="topLeft"
        style={{
          position: "absolute",
          left: `${-handleSize / 2}px`,
          top: `${-handleSize / 2}px`,
          width: `${handleSize}px`,
          height: `${handleSize}px`,
          background: "blue",
          cursor: "nwse-resize",
        }}
      ></div>
      <div
        className="topRight"
        style={{
          position: "absolute",
          top: `${-handleSize / 2}px`,
          right: `${-handleSize / 2}px`,
          width: `${handleSize}px`,
          height: `${handleSize}px`,
          background: "blue",
          cursor: "nesw-resize",
        }}
      ></div>
      <div
        className="botLeft"
        style={{
          position: "absolute",
          bottom: `${-handleSize / 2}px`,
          left: `${-handleSize / 2}px`,
          width: `${handleSize}px`,
          height: `${handleSize}px`,
          background: "blue",
          cursor: "nesw-resize",
        }}
      ></div>
      <div
        className="botRight"
        style={{
          position: "absolute",
          bottom: `${-handleSize / 2}px`,
          right: `${-handleSize / 2}px`,
          width: `${handleSize}px`,
          height: `${handleSize}px`,
          background: "blue",
          cursor: "nwse-resize",
        }}
      ></div>
    </GridItem>
  );
}

export default memo(SelectionBox);
