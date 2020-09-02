import { useRef, useCallback, PropsWithChildren, ForwardRefRenderFunction, useImperativeHandle, forwardRef, memo } from "react";
import { Coord, clamp } from "./util";
import { useGesture } from "react-use-gesture";
import { FullGestureState } from "react-use-gesture/dist/types";
import { useSpring, useMotionValue } from "framer-motion";


import React from "react";

export interface ViewportProps {
  baseScalar: number,
  baseUnit: string,
  height: number,
  width: number,
}
export type GridSpace = "gridspace";
export type CanvasSpace = "canvasspace";
export type ClientSpace = "clientspace";

const minScale = 0.2;
const maxScale = 2;

export interface ViewportRef {
  clientToGrid(coord: [number, number]): Coord<GridSpace>
}

export interface Transform {
  scale: number,
  offset: Coord<GridSpace>,
}

export const ViewportElem: ForwardRefRenderFunction<ViewportRef, PropsWithChildren<ViewportProps>> = (props, ref) => {
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);

  const transform = useRef<Transform>({
    scale: 1,
    offset: [0, 0] as Coord<GridSpace>,
  });

  const setTransform = (f: (t: Transform) => Transform) => {
    const newT = f(transform.current);
    const newOffset = [
      clamp(newT.offset[0], 0, props.width),
      clamp(newT.offset[1], 0, props.height)
    ]
    transform.current = {
      scale: newT.scale,
      offset: newOffset as any,
    }
    console.log("offset", transform.current.offset);
    canvas.current!.style.fontSize = `${transform.current.scale * props.baseScalar}${props.baseUnit}`
    viewport.current!.scrollTo(transform.current.offset[0] * 96 * transform.current.scale, transform.current.offset[1] * transform.current.scale * 96)
  }
    // Does fancy math to zoom around a mouse location. Location given relative to viewport
    const performZoom = 
      (origin: Coord<GridSpace>, oldScale: number, newScale: number) => {
        const delta = clamp(newScale - oldScale, -0.05, 0.05);
        newScale = clamp(oldScale + delta, minScale, maxScale);
        // if we don't return early, we'll end up sliding around
        if (newScale === oldScale) {
          return;
        }
        setTransform(t => {
          console.log(transform.current.scale);
          return {
            scale: newScale,
            offset: [
                t.offset[0] - (t.offset[0] - origin[0]) * delta / oldScale,
                t.offset[1] - (t.offset[1] - origin[1]) * delta / oldScale,
            ] as Coord<GridSpace>
          }
        });
      }
  
    // const drag = useDrag((state) => {
    //   if (state.buttons !== 1) {
    //     return;
    //   }
    //   setTransform(t => {
    //     console.log(state);
    //     let o = clientToGrid(sub(state.initial as Offset<ViewSpace>, state.delta as Offset<ViewSpace>));
    //     o = coord_clamp(
    //       o,
    //       [0, 0],
    //       [
    //         props.width, props.height
    //       ]
    //     );
    //     return {
    //       ...t,
    //       offset: o
    //     };
    //   });
    // });
  
    const initialScale = useRef(1);
    useGesture(
      {
        onPinchEnd: () => {
          initialScale.current = transform.current.scale;
        },
        onPinch: 
          (state: FullGestureState<"pinch">) => {
            state.event?.preventDefault();
            state.event?.stopPropagation();
            //@ts-ignore
            const deltaY = state.event?.deltaY
            const origin =
              clientToGrid(state.origin as any);
            console.log(origin);
            let newScale: number;
            if (deltaY) {
              let delta = -1 * deltaY * 0.05 * transform.current.scale;
              newScale = transform.current.scale + delta;
            } else {
              newScale = (state.da[0] / state.initial[0] - 1) + initialScale.current!;
            }
            performZoom(
              origin,
              transform.current.scale,
              newScale
            );
          },
        onPinchStart: useCallback(
          (state: FullGestureState<"pinch">) => {
            console.log("pinchstarting");
            initialScale.current = transform.current.scale;
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
  
   const clientToGrid = (coord: [number, number]): Coord<GridSpace> => {
      const rect = canvas.current!.getBoundingClientRect();
      return [
        (coord[0] - rect.left) / 96 / transform.current.scale,
        (coord[1] - rect.top) / 96 / transform.current.scale,
      ] as Coord<GridSpace>;
    }
  
  useImperativeHandle(ref, () => ({
    clientToGrid,
  }), []);

    // Wheel must come first to prevent its use by pinch,
    // because the logic for how to zoom on each is different
    const scroll = useGesture({
      onScrollEnd(state: FullGestureState<'scroll'>) {
        console.log("OOPS", state.pinching);
        setTransform(t => ({
          ...t,
          offset: [viewport.current!.scrollLeft / 96 / transform.current.scale, viewport.current!.scrollTop / 96 / transform.current.scale] as any,
        }));
      },
    });
    // useLayoutEffect(() => {
    //   viewport.current?.scrollTo(...(transform.current.offset as [number, number]));
    // }, []);
    return (
      <div className="viewport" {...scroll()} ref={viewport}>
        <div
          className="gridsvg"
          ref={canvas}
                style={{
                  width: `${props.width}em`,
                  height: `${props.height}em`,
                  fontSize: `${transform.current.scale * props.baseScalar}${props.baseUnit}`,
                  position: "relative",
                }}>
                {props.children}
            </div>
        </div>
    )
}

export const Viewport = memo(forwardRef(ViewportElem));