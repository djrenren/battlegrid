import { useRef, useState, useCallback, useEffect, EffectCallback, useLayoutEffect, PropsWithChildren, ForwardRefRenderFunction, useImperativeHandle, forwardRef, memo } from "react";
import { Coord, coord_clamp, clamp, add, Offset, sub } from "./util";
import { useDrag, useWheel, useGesture } from "react-use-gesture";
import { FullGestureState } from "react-use-gesture/dist/types";
import { useSpring } from "react-spring";
import React from "react";

export interface ViewportProps {
  baseScalar: number,
  baseUnit: string,
  height: number,
  width: number,
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

export interface ViewportRef {
  clientToGrid(coord: [number, number]): Coord<GridSpace>
}

export const ViewportElem: ForwardRefRenderFunction<ViewportRef, PropsWithChildren<ViewportProps>> = (props, ref) => {
    const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState({
    scale: 1,
    offset: [0, 0] as Coord<ViewSpace>,
  });
    const setScrollPos = (o: Coord<ViewSpace>) => {
      o = coord_clamp(
        o,
        [0, 0],
        [
          viewport.current!.scrollWidth - viewport.current!.offsetWidth,
          viewport.current!.scrollHeight - viewport.current!.offsetHeight,
        ]
      );
      setTransform(t => ({
        ...t,
        offset: o
      }));
    }
  
    // Does fancy math to zoom around a mouse location. Location given relative to viewport
    const performZoom = 
      (origin: Coord<ViewSpace>, oldScale: number, newScale: number) => {
        const delta = clamp(newScale - oldScale, -0.05, 0.05);
        newScale = clamp(oldScale + delta, minScale, maxScale);
        // if we don't return early, we'll end up sliding around
        if (newScale === oldScale) {
          return;
        }
        setTransform(t => {
          let left = ((origin[0] + t.offset[0]) * delta) / oldScale;
          let top = ((origin[1] + t.offset[1]) * delta) / oldScale;
          return {
            scale: newScale,
            offset: add(t.offset, [left, top] as Offset<ViewSpace>),
          }
        });
      }
  
    const drag = useDrag((state) => {
      if (state.buttons !== 1) {
        return;
      }
      setTransform(t => {
        let o = sub(t.offset, state.delta as Offset<ViewSpace>);
        o = coord_clamp(
          o,
          [0, 0],
          [
            viewport.current!.scrollWidth - viewport.current!.offsetWidth,
            viewport.current!.scrollHeight - viewport.current!.offsetHeight,
          ]
        );
        return {
          ...t,
          offset: o
        };
      });
    });
  
    const initialScale = useRef(1);
    const pinch = useGesture(
      {
        onPinch: useCallback(
          (state: FullGestureState<"pinch">) => {
            state.event?.preventDefault();
            state.event?.stopPropagation();
            //@ts-ignore
            const deltaY = state.event?.deltaY
            const origin = 
                (state.origin || getMouseCoords(state.event! as any)) as Coord<
                  ViewSpace
              >
            let newScale: number;
            if (deltaY) {
              let delta = -1 * deltaY * 0.05 * transform.scale;
              newScale = transform.scale + delta;
            } else {
              newScale = state.da[0] / state.initial[0] - 1 + initialScale.current!;
            }
            performZoom(
              origin,
              transform.scale,
              newScale
            );
          },
          [transform]
        ),
        onPinchStart: useCallback(
          (state: FullGestureState<"pinch">) => {
            state.event?.preventDefault();
            console.log("pinchstarting");
            initialScale.current = transform.scale;
          },
          [transform]
        ),
      },
      {
        domTarget: viewport,
        eventOptions: {
          passive: false,
          capture: true,
        },
      }
    );
  
  
  useImperativeHandle(ref, () => ({
    clientToGrid(coord: [number, number]): Coord<GridSpace> {
      const rect = canvas.current!.getBoundingClientRect();
      console.log(rect);
      return [
        (coord[0] - rect.left) / 96 / transform.scale,
        (coord[1] - rect.top) / 96 / transform.scale,
      ] as Coord<GridSpace>;
    }
  }), [transform.scale]);

    // Wheel must come first to prevent its use by pinch,
    // because the logic for how to zoom on each is different
    useEffect(pinch as EffectCallback, [pinch]);
    const scroll = useGesture({
      onScroll(state: FullGestureState<'scroll'>) {
        console.log("OOPS", state.pinching);
        setTransform(t => ({
          ...t,
          offset: [viewport.current!.scrollLeft, viewport.current!.scrollTop] as Coord<ViewSpace>,
        }));
      },
    });
    useLayoutEffect(() => {
      viewport.current?.scrollTo(...(transform.offset as [number, number]));
    }, [transform.offset]);
    return (
        <div className="grid viewport" ref={viewport}>
        <svg
          ref={canvas}
                viewBox={`0 0 ${props.width} ${props.height}`}
                style={{
                    width: `${props.width * props.baseScalar * transform.scale}${props.baseUnit}`,
                    height: `${props.height * props.baseScalar * transform.scale}${props.baseUnit}`
                }}>
                {props.children}
            </svg>
        </div>
    )
}

export const Viewport = memo(forwardRef(ViewportElem));