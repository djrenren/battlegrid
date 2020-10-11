import React, { memo, PropsWithChildren, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { addImage, Image } from "../../modules/game";
import useDrop from "../util/useDrop";
import { GridContext } from "./Grid";

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

// Implements the drag and drop image functionality!
export function DropLayer(props: PropsWithChildren<{}>) {
  const dropLayer = useRef<HTMLDivElement>(null);
  const hoverHint = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const grid = useContext(GridContext);

  let [dragging, drag, dragHandlers] = useDrop(
    dropLayer,
    (x, y) => {
      if (hoverHint.current) {
        let coords = grid.client_to_grid([x, y]);
        hoverHint.current.style.left = Math.floor(coords[0] as number) + "em";
        hoverHint.current.style.top = Math.floor(coords[1] as number) + "em";
      }
    },
    async (ev) => {
      let coords = grid.client_to_grid([ev.clientX, ev.clientY]);
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
  let gridDrag: [number, number];
  if (dragging) {
    gridDrag = grid.client_to_grid([drag.x, drag.y]);
  }

  return (
    <div
      {...dragHandlers}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
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
      {props.children}
    </div>
  );
}
export default memo(DropLayer);