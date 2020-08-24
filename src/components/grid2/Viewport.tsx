import { useRef, useState, useCallback, useEffect, EffectCallback, useLayoutEffect, PropsWithChildren } from "react";
import { Coord, coord_clamp, clamp, add, Offset, sub } from "./util";
import { useDrag, useWheel, useGesture } from "react-use-gesture";
import { FullGestureState } from "react-use-gesture/dist/types";
import React from "react";

export interface ViewportProps {
    baseScalar: number,
    baseUnit: string,
    dimensions: Offset<GridSpace>,
}
export type GridSpace = "gridspace";
type ViewSpace = "gridspace";

const minScale = 0.2;
const maxScale = 2;

export function coord<T>(vals: [number, number]): Coord<T> {
  return vals as Coord<T>;
}

export function offset<T>(vals: [number, number]): Offset<T> {
  return vals as Offset<T>;
}

function getMouseCoords(ev: MouseEvent) {
  let mouseX = ev.pageX - window.scrollX;
  let mouseY = ev.pageY - window.scrollY;
  return [mouseX, mouseY];
}
export function Viewport(props: PropsWithChildren<ViewportProps>) {
    const viewport = useRef<HTMLDivElement>(null);
    const [scaleState, setScaleState] = useState(1);
    const [offsetState, setOffsetState] = useState([0, 0] as Coord<ViewSpace>);
    const setScrollPos = useCallback((o: Coord<ViewSpace>) => {
      o = coord_clamp(
        o,
        [0, 0],
        [
          viewport.current!.scrollWidth - viewport.current!.offsetWidth,
          viewport.current!.scrollHeight - viewport.current!.offsetHeight,
        ]
      );
      setOffsetState(o);
    }, []);
  
    // Does fancy math to zoom around a mouse location. Location given relative to viewport
    const performZoom = useCallback(
      (origin: Coord<ViewSpace>, oldScale: number, newScale: number) => {
        console.log(origin, oldScale, newScale);
        const delta = clamp(newScale - oldScale, -0.05, 0.05);
        newScale = clamp(oldScale + delta, minScale, maxScale);
        // if we don't return early, we'll end up sliding around
        if (newScale === oldScale) {
          console.log("early return?");
          return;
        }
        console.log("SCROLL POS", offsetState);
        let left = ((origin[0] + offsetState[0]) * delta) / oldScale;
        let top = ((origin[1] + offsetState[1]) * delta) / oldScale;
        setScaleState(newScale);
        console.log(newScale);
        setScrollPos(add(offsetState, [left, top] as Offset<ViewSpace>));
      },
      [setScaleState, setScrollPos, offsetState]
    );
  
    const drag = useDrag((state) => {
      if (state.buttons === 1) {
        setScrollPos(sub(offsetState, state.delta as Offset<ViewSpace>));
      }
    });
  
    const wheel = useWheel(
      useCallback(
        (state: FullGestureState<"wheel">) => {
          if (state.ctrlKey) {
            console.log(state);
            state.event?.preventDefault();
            state.event?.stopPropagation();
            //@ts-ignore
            state.event?.stopImmediatePropagation();
            let origin = getMouseCoords(state.event as any);
            let delta = -1 * (state.delta[1] ?? 0) * 0.05 * scaleState;
            console.log("delta", delta);
            let newScale = scaleState + delta;
            performZoom(origin as Coord<ViewSpace>, scaleState, newScale);
          }
        },
        [scaleState, performZoom]
      ),
      {
        domTarget: viewport,
        eventOptions: {
          passive: false,
        },
      }
    );
  
    const initialScale = useRef(1);
    const initialDistance = useRef(1);
    const pinch = useGesture(
      {
        onPinch: useCallback(
          (state: FullGestureState<"pinch">) => {
            state.event?.preventDefault();
            console.log("pinching", state);
            if (state.initial)
              performZoom(
                (state.origin || getMouseCoords(state.event! as any)) as Coord<
                  ViewSpace
                >,
                scaleState,
                state.da[0] / state.initial[0] - 1 + initialScale.current!
              );
          },
          [initialScale, performZoom, scaleState]
        ),
        onPinchStart: useCallback(
          (state: FullGestureState<"pinch">) => {
            state.event?.preventDefault();
            console.log("pinchstarting");
            initialScale.current = scaleState;
            initialDistance.current = state.da[0];
          },
          [initialDistance, scaleState]
        ),
      },
      {
        domTarget: viewport,
        eventOptions: {
          passive: false,
        },
      }
    );

    // Wheel must come first to prevent its use by pinch,
    // because the logic for how to zoom on each is different
    useEffect(wheel as EffectCallback, [wheel]);
    useEffect(pinch as EffectCallback, [pinch]);
    const scroll = useGesture({
      onScroll() {
            setOffsetState([viewport.current!.scrollLeft, viewport.current!.scrollTop] as Coord<ViewSpace>);
      },
    });
    useLayoutEffect(() => {
      viewport.current?.scrollTo(...(offsetState as [number, number]));
    }, [viewport, offsetState]);
    return (
        <div className="grid viewport" {...drag()} {...scroll()} ref={viewport}>
            <svg
                viewBox={`0 0 ${props.dimensions[0]} ${props.dimensions[0]}`}
                style={{
                    width: `${props.dimensions[0] * props.baseScalar * scaleState}${props.baseUnit}`,
                    height: `${props.dimensions[1] * props.baseScalar * scaleState}${props.baseUnit}`
                }}>
                {props.children}
            </svg>
        </div>
    )
}