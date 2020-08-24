import { GridItemProps } from "./GridItem";
import React, { useState, useCallback } from "react";
import { Offset } from "./navigation";

interface SelectionProps {
    item: GridItemProps,
    offset: Offset,
    onDrag?: (clientOffset: Offset)=>void
    onDrop?: (clientOffset: Offset)=>void
}

function Selection(props: SelectionProps) {
    // Represents the distance in client pixels from selection element origin to click point
    let [initialLoc, setInitialLoc] = useState<Offset|null>(null);
    const onPointerMove = useCallback(ev => {
        if (initialLoc && props.onDrag) {
            ev.preventDefault();
            ev.stopPropagation();
            console.log(ev.clientX, ev.clientY)
            props.onDrag([ev.clientX-initialLoc[0], ev.clientY-initialLoc[1]]);
        }
    }, [props, initialLoc])
    const onPointerUp = useCallback((ev) => {
        if (initialLoc && props.onDrop) {
            ev.preventDefault();
            ev.stopPropagation();
            (ev.currentTarget as SVGRectElement).releasePointerCapture(ev.pointerId);
            setInitialLoc(null);
            props.onDrop([ev.clientX, ev.clientY]);
        }
    }, [props, initialLoc])
    return (
        <rect
            x={props.item.x + props.offset[0]}
            y={props.item.y + props.offset[1]}
            width={props.item.width}
            height={props.item.height}
            stroke="blue"
            strokeWidth="0.05"
            fill="red"
            filter="url(#shadow)"
            onPointerDown={ev => {
                ev.preventDefault();
                ev.stopPropagation();
                console.log("CLICKED SELECTION!")
                ev.currentTarget.setPointerCapture(ev.pointerId);
                setInitialLoc([ev.clientX, ev.clientY]);
            }}
            onPointerMoveCapture={onPointerMove}
            onPointerUpCapture={onPointerUp}
        ></rect>
    )
}

export default Selection;