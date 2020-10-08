import React, { memo, PropsWithChildren, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addImage, Image, updateImage } from "../../modules/game";
import { add, Coord, floor, GridSpace, sub } from "../../modules/game/units";
import { RootStore } from "../../store";
import useDrop from "../util/useDrop";
import "./grid.css";
import { GridItem } from "./GridItem";
import Overlay from "./Overlay";
import SelectionBox from "./SelectionBox";
import { Viewport, ViewportRef } from "./Viewport";

export interface GridProps {
  dimensions: [number, number];
}

async function getDataURL(file: File): Promise<string> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

function extractURLFromHTML(html: string): string | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.querySelector("img")?.src || null;
}
export function Grid(props: PropsWithChildren<GridProps>) {
  let dropLayer = useRef<HTMLDivElement>(null);
  let selection = useRef<any>(null);
  let [selectionOffset, setSelectionOffset] = useState<any>(null);
  let viewport = useRef<ViewportRef>(null);
  let hoverHint = useRef<HTMLDivElement>(null);
  let items = useSelector((state: RootStore) => state.game.maps[0].images);
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
    async (ev) => {
      let coords = viewport.current!.clientToGrid([ev.clientX, ev.clientY]);
      let dataItems = ev.dataTransfer?.items ?? [];
      let addItem = (s: string) => {
        console.log(s);
        let item = {
          id: "" + Math.random(),
          loc: [Math.floor(coords[0]), Math.floor(coords[1])],
          dim: [1, 1],
          href: s,
        };
        dispatch(addImage({ map: 0, img: (item as unknown) as Image }));
      };
      console.log("DataItems", dataItems.length);
      for (let i = 0; i < dataItems.length; i++) {
        console.log(dataItems[i].type);
        if (dataItems[i].type.startsWith("image/")) {
          const dataURL = await getDataURL(dataItems[i].getAsFile()!);
          addItem(dataURL);
          return;
        }
        if (dataItems[i].type === "text/html") {
          dataItems[i].getAsString((s) => addItem(extractURLFromHTML(s)!));
          return;
        }
        if (dataItems[i].type === "application/x-moz-file-promise-url") {
          dataItems[i].getAsString(addItem);
          return;
        } else if (dataItems[i].kind === "string") {
          let t = dataItems[i].type;
          dataItems[i].getAsString((s) => console.log(t, s));
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
      <Viewport ref={viewport}>
        <div
          style={{
            width: props.dimensions[0] + "in",
            height: props.dimensions[1] + "in",
            position: "relative",
          }}
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
              onPointerDown={(ev) => {
                ev.preventDefault();
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
              loc={add(selectionOffset!, selection.current.loc) as any}
              dim={selection.current.dim}
              onSelectionDrag={(coord) =>
                setSelectionOffset(
                  floor(
                    sub(
                      viewport.current!.clientToGrid(coord),
                      selection.current.loc
                    )
                  )
                )
              }
              onSelectionDrop={(coord) => {
                const loc = floor(viewport.current!.clientToGrid(coord));
                dispatch(
                  updateImage({
                    map: 0,
                    id: selection.current.id,
                    img: {
                      loc,
                    },
                  })
                );
                setSelectionOffset(null);
                selection.current = null;
              }}
            />
          )}
        </div>
      </Viewport>
    </div>
  );
}

export default memo(Grid);
