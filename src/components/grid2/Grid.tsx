import React, {
  createContext,
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { moveImage, updateImage } from "../../modules/game";
import { add, coord_clamp, floor, sub } from "../../modules/game/units";
import { RootStore } from "../../store";
import { DropLayer } from "./DropLayer";
import "./grid.css";
import { GridItem } from "./GridItem";
import Overlay from "./Overlay";
import SelectionBox from "./SelectionBox";
import { Viewport, ViewportRef } from "./Viewport";

export interface GridProps {
  dimensions: [number, number];
}

export const GridContext = createContext({
  client_to_grid(coord: [number, number]): [number, number] {
    return [0, 0];
  },
});

export function Grid(props: PropsWithChildren<GridProps>) {
  let viewport = useRef<ViewportRef>(null);
  let dispatch = useDispatch();

  let items = useSelector((state: RootStore) => state.game.maps[0].images);

  let [selectionOffset, setSelectionOffset] = useState<any>(null);
  let [selection, setSelection] = useState<string[]>([]);
  let selection_loc = useMemo(
    () => (selection.length > 0 ? items[selection[0]].loc : ([0, 0] as any)),
    [items, selection]
  );
  const onSelectionDrag = useCallback(
    (coord) => {
      setSelectionOffset(
        floor(
          sub(
            coord_clamp(
              viewport.current!.clientToGrid(coord),
              [0, 0],
              sub(props.dimensions as any, items[selection[0]].dim)
            ),
            selection_loc
          )
        )
      );
    },
    [selection_loc, props.dimensions, items, selection]
  );

  const onSelectionDrop = useCallback(
    (coord) => {
      dispatch(
        updateImage({
          map: 0,
          id: selection[0],
          img: {
            loc: add(items[selection[0]].loc, selectionOffset),
          },
        })
      );
      setSelectionOffset([0, 0]);
    },
    [dispatch, items, selection, selectionOffset]
  );

  const onKeyPress = useCallback(
    (ev: KeyboardEvent) => {
      if (selection.length === 0) return;
      const resource = { map: 0, id: selection[0] };
      switch (ev.key) {
        case "ArrowRight":
          dispatch(moveImage({ ...resource, offset: [1, 0] }));
          ev.preventDefault();
          break;
        case "ArrowLeft":
          dispatch(moveImage({ ...resource, offset: [-1, 0] }));
          ev.preventDefault();
          break;
        case "ArrowUp":
          dispatch(moveImage({ ...resource, offset: [0, -1] }));
          ev.preventDefault();
          break;
        case "ArrowDown":
          dispatch(moveImage({ ...resource, offset: [0, 1] }));
          ev.preventDefault();
          break;
      }
    },
    [dispatch, selection]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress, { capture: true });
    return () => {
      document.removeEventListener("keydown", onKeyPress, { capture: true });
    };
  }, [onKeyPress]);

  return (
    <div className="grid">
      <Viewport ref={viewport}
        overlay={
            selection.length > 0 && (
              <SelectionBox
                key=""
                loc={add(selectionOffset!, selection_loc) as any}
                dim={items[selection[0]].dim}
                onSelectionDrag={onSelectionDrag}
                onSelectionDrop={onSelectionDrop}
              />
            )
        } 
      >
        <GridContext.Provider
          value={{
            get client_to_grid() {
              return viewport.current!.clientToGrid;
            },
          }}
        >
          <div
            style={{
              width: props.dimensions[0] + "in",
              height: props.dimensions[1] + "in",
              position: "relative",
            }}
          >
            <DropLayer>
              {Object.values(items).map((item, i) => (
                <GridItem
                  id={item.id}
                  key={item.id}
                  loc={
                    add(
                      item.loc,
                      selection.includes(item.id)
                        ? (selectionOffset as any)
                        : [0, 0]
                    ) as any
                  }
                  dim={item.dim}
                  tabIndex={i}
                  onFocus={(ev) => {
                    setSelection([item.id]);
                    setSelectionOffset([0, 0]);
                  }}
                  onBlur={(ev) => {
                    setSelection([]);
                  }}
                >
                  <img
                    onDragStart={(ev) => ev.preventDefault()}
                    alt=""
                    src={item.href}
                    style={{ display: "block", width: "100%", height: "100%" }}
                  />
                </GridItem>
              ))}
              <Overlay
                width={props.dimensions[0]}
                height={props.dimensions[1]}
              />
            </DropLayer>
          </div>
        </GridContext.Provider>
      </Viewport>
    </div>
  );
}

export default memo(Grid);
