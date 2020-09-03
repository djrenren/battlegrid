import { PropsWithChildren, useRef, useState, memo } from "react";
import { Coord, add, floor, sub } from "./util";
import React from "react";
import Overlay from "./Overlay2";
import "./grid.css";
import { Viewport, GridSpace, ViewportRef } from "./Viewport";
import useDrop from "../util/useDrop";
import { GridItem } from "./GridItem";
import SelectionBox from "./SelectionBox";

export interface GridProps {
  dimensions: [number, number];
}

export function Grid(props: PropsWithChildren<GridProps>) {
  let dropLayer = useRef<HTMLDivElement>(null);
  let selection = useRef<any>(null);
  let [selectionOffset, setSelectionOffset] = useState<any>(null);
  let viewport = useRef<ViewportRef>(null);
  let hoverHint = useRef<HTMLDivElement>(null);
  let [items, setItems] = useState<any[]>([]);

  let [dragging, drag, dragHandlers] = useDrop(
    dropLayer,
    (x, y) => {
      if (hoverHint.current) {
        let coords = viewport.current!.clientToGrid([x, y]);
        hoverHint.current.style.left = Math.floor(coords[0] as number) + "em";
        hoverHint.current.style.top = Math.floor(coords[1] as number) + "em";
      }
    },
    (ev) => {
      let coords = viewport.current!.clientToGrid([ev.clientX, ev.clientY]);
      ;
      let dataItems = ev.dataTransfer?.items ?? [];
      let addItem = (s: string, i: number) => {
        ;
        let item = {
          id: "" + Math.random(),
          x: Math.floor(coords[0]) + i,
          y: Math.floor(coords[1]),
          width: 1,
          height: 1,
          href: s,
        };
        ;
        setItems([...items, item]);
      };
      ;
      ;
      for (let i = 0; i < dataItems.length; i++) {
        ;
        if (dataItems[i].kind.startsWith("image/")) {
          addItem(window.URL.createObjectURL(dataItems[i].getAsFile()), 0);
        } else if (dataItems[i].type === "text/uri-list") {
          dataItems[i].getAsString((s) => addItem(s, 0));
        }
      }
    }
  );
  let gridDrag: Coord<GridSpace>;
  if (dragging) {
    gridDrag = viewport.current!.clientToGrid([drag.x, drag.y]);
  }
  ;
  return (
    <div className="grid" {...dragHandlers} ref={dropLayer}>
      <Viewport
        ref={viewport}
        baseScalar={1}
        baseUnit="in"
        width={props.dimensions[0]}
        height={props.dimensions[1]}
      >
        {dragging ? (
          <div
            ref={hoverHint}
            key="hover"
            style={{
              position: "absolute",
              left: Math.floor(gridDrag![0]) + "em",
              top: Math.floor(gridDrag![1]) + "em",
              width: "1em",
              height: "1em",
              background: "#aaa",
            }}
          ></div>
        ) : null}
        {items.map((i) => (
          <GridItem
            key={i.id}
            loc={
              add(
                [i.x, i.y] as any,
                selection.current?.id === i.id
                  ? (selectionOffset as any)
                  : [0, 0]
              ) as any
            }
            dim={[1, 1] as any}
            onClick={() => {
              selection.current = i;
              setSelectionOffset([0, 0]);
            }}
          >
            <img
              alt=""
              src={i.href}
              style={{ display: "block", width: "100%", height: "100%" }}
            />
          </GridItem>
        ))}
        <Overlay width={props.dimensions[0]} height={props.dimensions[1]} />
        {selection.current && (
          <SelectionBox
            key=""
            loc={
              add(selectionOffset!, [
                selection.current.x,
                selection.current.y,
              ] as any) as any
            }
            dim={[1, 1] as any}
            onSelectionDrag={(coord) =>
              setSelectionOffset(
                floor(
                  sub(viewport.current!.clientToGrid(coord), [
                    selection.current.x,
                    selection.current.y,
                  ] as any)
                )
              )
            }
            onSelectionDrop={(coord) => {
              const loc = floor(viewport.current!.clientToGrid(coord));
              const currId = selection.current.id;
              setItems((items) =>
                items.map((it) => {
                  if (it.id === currId) {
                    return { ...it, x: loc[0], y: loc[1] };
                  } else {
                    return it;
                  }
                })
              );
              setSelectionOffset(null);
              selection.current = null;
            }}
          />
        )}
      </Viewport>
    </div>
  );
}

export default memo(Grid);
