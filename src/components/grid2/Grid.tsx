import {
  PropsWithChildren, useRef, useState, memo,
} from "react";
import { Coord } from "./util";
import React from "react";
import Overlay  from "./Overlay2";
import "./grid.css";
import { Viewport, GridSpace, ViewportRef } from "./Viewport";
import useDrop from "../util/useDrop";


export interface GridProps {
  dimensions: [number, number];
}

export function Grid(props: PropsWithChildren<GridProps>) {
  let dropLayer = useRef<HTMLDivElement>(null);
  let viewport = useRef<ViewportRef>(null);
  let hoverHint = useRef<HTMLDivElement>(null);
  let [items, setItems] = useState<any[]>([]);
  let [dragging, drag, dragHandlers] = useDrop(dropLayer, (x, y) => {
    if (hoverHint.current) {
      let coords = viewport.current!.clientToGrid([x, y]);
      hoverHint.current.style.left = Math.floor(coords[0] as number) + "em";
      hoverHint.current.style.top = Math.floor(coords[1] as number) + "em";
    }
  },(ev) => {
    let coords = viewport.current!.clientToGrid([ev.clientX, ev.clientY]);
    console.log("DROP!");
    let dataItems = ev.dataTransfer?.items ?? [];
    let addItem = (s: string, i: number) => {
      console.log("adding item?");
      let item = {
        id: "" + Math.random(),
        x: Math.floor(coords[0]) + i,
        y: Math.floor(coords[1]),
        width: 1,
        height: 1,
        href: s,
      };
      console.log("DROPPING? ", item);
      setItems([...items, item]);
    };
    console.log("event", ev);
    console.log("items", dataItems);
    for (let i = 0; i < dataItems.length; i++) {
      console.log(dataItems[i]);
      if (dataItems[i].kind.startsWith("image/")) {
        addItem(window.URL.createObjectURL(dataItems[i].getAsFile()), 0);
      } else if (dataItems[i].type === "text/uri-list") {
        dataItems[i].getAsString((s) => addItem(s, 0));
      }
    }
  });
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
        {dragging ? <div
          ref={hoverHint}
          key="hover"
          style={{
            position: "absolute",
            left: Math.floor(gridDrag![0])+"em",
            top: Math.floor(gridDrag![1])+"em",
            width: "1em",
            height: "1em",
            background: "#aaa",
          }}
        ></div> : null}
        {items.map(i => <img
          alt=""
          key={i.id + ""}
          src={i.href}
          style={{
            position: "absolute",
            left: i.x+"em",
            top: i.y+"em",
            width: "1em",
            height: "1em",
            display: "block",
          }} 
        ></img>)}

        <Overlay width={props.dimensions[0]} height={props.dimensions[1]} />
    
      </Viewport>
      </div>
  );
}

export default memo(Grid);
