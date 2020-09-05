import { PropsWithChildren, useRef, useState, memo } from "react";
import { Coord, add, floor, sub, GridSpace } from "../../modules/grid/units";
import React from "react";
import Overlay from "./Overlay";
import "./grid.css";
import { Viewport, ViewportRef } from "./Viewport";
import useDrop from "../util/useDrop";
import { GridItem } from "./GridItem";
import SelectionBox from "./SelectionBox";
import { useSelector, useDispatch } from "react-redux";
import { RootStore } from "../../store";
import { addImage, Image, updateImage } from "../../modules/grid";

export interface GridProps {
  dimensions: [number, number];
}

export function Grid(props: PropsWithChildren<GridProps>) {
  let dropLayer = useRef<HTMLDivElement>(null);
  let selection = useRef<any>(null);
  let [selectionOffset, setSelectionOffset] = useState<any>(null);
  let viewport = useRef<ViewportRef>(null);
  let hoverHint = useRef<HTMLDivElement>(null);
  let items = useSelector((state: RootStore) => state.grid.images);
  let dispatch = useDispatch();

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
      let dataItems = ev.dataTransfer?.items ?? [];
      let addItem = (s: string, i: number) => {
        let item = {
          id: "" + Math.random(),
          loc: [Math.floor(coords[0]) + i, Math.floor(coords[1])],
          dim: [1,1],
          href: s,
        };
        dispatch(addImage(item as unknown as Image));
      };
      for (let i = 0; i < dataItems.length; i++) {
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
        {Object.values(items).map((i) => (
          <GridItem
            key={i.id}
            loc={
              add(
                i.loc,
                selection.current?.id === i.id
                  ? (selectionOffset as any)
                  : [0, 0]
              ) as any
            }
            dim={i.dim}
            onClick={() => {
              selection.current = i;
              setSelectionOffset([0, 0]);
            }}
          >
            <img
              onDragStart={(ev) => ev.preventDefault()}
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
              add(selectionOffset!, selection.current.loc) as any
            }
            dim={selection.current.dim}
            onSelectionDrag={(coord) =>
              setSelectionOffset(
                floor(
                  sub(viewport.current!.clientToGrid(coord), selection.current.loc)
                )
              )
            }
            onSelectionDrop={(coord) => {
              const loc = floor(viewport.current!.clientToGrid(coord));
              dispatch(updateImage({
                id: selection.current.id,
                img: {
                  ...items[selection.current.id],
                  loc
                }
              }));
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
