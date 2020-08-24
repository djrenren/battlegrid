import React, {
  useState,
  useRef,
  PropsWithChildren,
  useCallback,
  useMemo,
} from "react";
import { GridItem, GridItemProps } from "./GridItem";
import Selection from "./Selection";
import "./Grid.css";
import { useNavigation, Offset } from "./navigation";
import useDrop from "../util/useDrop";

interface GridProps {
  dimX: number;
  dimY: number;
}

interface SelectionState {
  id: string;
  offset: Offset;
}

function Grid(props: PropsWithChildren<GridProps>) {
  let ref = useRef<HTMLDivElement>(null);
  let svgRef = useRef<SVGSVGElement>(null);
  let surfaceRef = useRef<HTMLDivElement>(null);
  let [items, setItems] = useState<GridItemProps[]>([]);
  let [selection, setSelection] = useState<SelectionState | null>(null);
  let [scale, offset, listeners] = useNavigation(
    ref,
    svgRef,
    props.dimX,
    props.dimY
  );
  const selectedItem = useMemo(
    () => items.find((i) => i.id === selection?.id),
    [selection, items]
  );

  const itemClick = useCallback(
    (id: string) => {
      console.log("CLICKED!");
      let item = items.find((i) => i.id === id)!;
      setSelection({ id, offset: [0,0] });
    },
    [items, scale]
  );
  const viewOffsetToGridOffset = useCallback(
    (o: Offset): Offset => {
      console.log(o);
      return [
        (o[0] / 96) / scale.current!,
        (o[1] / 96) / scale.current!,
      ];
    },
    [svgRef, scale]
  ); 
  const viewCoordToGridCoord = useCallback(
    (o: Offset): Offset => {
      let rect = svgRef.current!.getBoundingClientRect();
      return viewOffsetToGridOffset([o[0] - rect.x, o[1] - rect.y])
    },
    [viewOffsetToGridOffset]
  );



  const nearestGridCoord = useCallback(
    (o: Offset): Offset => viewCoordToGridCoord(o).map(Math.floor) as Offset,
    [viewCoordToGridCoord]
  );

  const onSelectionDrag = useCallback(
    (o) => {
      console.log("SELECTION DRAG")
      let gridO = viewOffsetToGridOffset(o);
      setSelection({
        ...selection!,
        offset: gridO,
      });
    },
    [viewOffsetToGridOffset, selectedItem, selection]
  );
  const onSelectionDrop = useCallback(
    (o) => {
      let gridO = nearestGridCoord(o);
      setItems((items) =>
        items.map((item) => {
          if (item.id === selection?.id) {
            return { ...item, x: gridO[0], y: gridO[1] };
          } else {
            return item;
          }
        })
      );
      setSelection((sel) => {
        return { ...sel!, offset: [0,0] };
      });
    },
    [items, selection, nearestGridCoord]
  );
  const [isDraggedOver, handlers] = useDrop(
    surfaceRef,
    useCallback(
      (ev) => {
        ev.preventDefault();
        const [x, y] = nearestGridCoord([ev.clientX, ev.clientY]);
        console.log("DROP!");
        let dataItems = ev.dataTransfer?.items ?? [];
        let addItem = (s: string, i: number) => {
          console.log("adding item?");
          let item = {
            id: "" + Math.random(),
            x: x + i,
            y,
            width: 1,
            height: 1,
            href: s,
          };
          console.log("DROPPING? ", item);
          setItems([...items, item]);
        };
        for (let i = 0; i < dataItems.length; i++) {
          console.log(dataItems[i]);
          if (dataItems[i].kind.startsWith("image/")) {
            addItem(window.URL.createObjectURL(dataItems[i].getAsFile()), 0);
          } else if (dataItems[i].type === "text/uri-list") {
            dataItems[i].getAsString((s) => addItem(s, 0));
          }
        }
      },
      [items, nearestGridCoord]
    )
  );

  const itemElem = useCallback((item) =>
    GridItem({
      ...item,
      ...(item.id !== selection?.id
        ? {}
        : {
          x: item.x + selection!.offset[0],
          y: item.y + selection!.offset[1],
        }),
      onClick: () => {
        itemClick(item.id);
      },
    }), [itemClick, selection]);
  return (
    <div
      ref={surfaceRef}
      className={`grid-surface full-height-container ${
        isDraggedOver ? "dragover" : ""
      }`}
      {...handlers}
    >
      <div className="grid" ref={ref}>
        <svg
          viewBox={`0 0 ${props.dimX} ${props.dimY}`}
          xmlns="http://www.w3.org/2000/svg"
          className="gridsvg"
          style={{
            display: "block",
            overflow: "hidden",
          }}
          ref={svgRef}
          overflow="hidden"
          {...listeners}
        >
          <defs>
            <filter id="shadow">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="0.03"
                floodColor="blue"
                floodOpacity="0.8"
              />
              <feComposite operator="out" in2="SourceGraphic" />
            </filter>
            <pattern
              id="grid"
              width="1"
              height="1"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 1 0 L 0 0 0 1 1 1 1 0"
                fill="none"
                stroke="gray"
                strokeWidth="0.05"
              ></path>
            </pattern>
          </defs>
          {items.map(itemElem)}
          {props.children}

          <rect
            style={{
              resize: "both",
              overflow: "auto",
              pointerEvents: "none",
            }}
            x="-0.5"
            y="-0.5"
            width={props.dimX}
            height={props.dimY}
            fill="url(#grid)"
          ></rect>
          {selection && (
            <Selection
              item={selectedItem!}
              offset={selection.offset}
              onDrag={onSelectionDrag}
              onDrop={onSelectionDrop}
            />
          )}
        </svg>
      </div>
    </div>
  );
}

export default Grid;
