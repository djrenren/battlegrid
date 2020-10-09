import React, {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import { Coord, GridSpace } from "../../modules/game/units";

export interface ViewportProps {}

const min_scale = 0.1;
const max_scale = 2;
const scroll_factor = 0.07;
//const scrollbar_px = 15;

export interface ViewportRef {
  clientToGrid(coord: [number, number]): Coord<GridSpace>;
}

function inch(px: number) {
  return px / 96;
}

export const ViewportElem: ForwardRefRenderFunction<
  ViewportRef,
  PropsWithChildren<ViewportProps>
> = (props, ref) => {
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);

  // v_loc is not updated after creation. Do not move the viewport
  // and expect it to work
  const v_loc = useRef({
    x: 0,
    y: 0,
  });
  const scale = useRef(1);
  const v_dim = useRef({
    width: 0,
    height: 0,
  });
  const c_dim = useRef({
    width: 0,
    height: 0,
  });

  const offset = useRef([0, 0] as [number, number]);

  const manualRender = () => {
    offset.current = [
      Math.max(
        0,
        (v_dim.current.width - c_dim.current.width * scale.current) / 2
      ),
      Math.max(
        0,
        (v_dim.current.height - c_dim.current.height * scale.current) / 2
      ),
    ];
    console.log("offset", offset);
    canvas.current!.style.transform = `translate(${offset.current[0]}px, ${offset.current[1]}px) scale(${scale.current})`;
  };
  const performZoom2 = useCallback(
    (grid_pos: [number, number], proposed_delta: number) => {
      const new_scale = Math.min(
        max_scale,
        Math.max(min_scale, scale.current + proposed_delta)
      );
      console.log(new_scale);
      const delta = new_scale - scale.current;
      scale.current = new_scale;
      const left = viewport.current!.scrollLeft;
      const top = viewport.current!.scrollTop;
      manualRender();
      viewport.current!.scrollTo(
        left + grid_pos[0] * delta,
        top + grid_pos[1] * delta
      );
    },
    []
  );

  const client_to_grid = useCallback(
    ([x, y]: [number, number]): [number, number] => {
      const vx = x - v_loc.current.x + viewport.current!.scrollLeft;
      const vy = y - v_loc.current.y + viewport.current!.scrollTop;
      return [
        (vx - offset.current[0]) / scale.current,
        (vy - offset.current[1]) / scale.current,
      ];
    },
    [offset]
  );

  useImperativeHandle(
    ref,
    () => ({
      //@ts-ignore
      clientToGrid: (...args) => {
        return client_to_grid(...args).map(inch);
      },
    }),
    [client_to_grid]
  );

  const onWheel = useCallback(
    (ev: WheelEvent) => {
      if (!ev.ctrlKey) return;
      const grid_loc = client_to_grid([ev.clientX, ev.clientY]);
      const delta = Math.max(-1, Math.min(1, -ev.deltaY)) * scroll_factor;
      performZoom2(grid_loc, delta);
    },
    [performZoom2, client_to_grid]
  );

  // Set up wheel-based zooming / touchpad pinch-to-zoom on chrome and firefox
  useEffect(() => {
    const v = viewport.current!;
    const prevDefault = (ev: WheelEvent) => ev.ctrlKey && ev.preventDefault();
    v.addEventListener("wheel", prevDefault, { passive: false });
    v.addEventListener("wheel", onWheel);
    return () => {
      v.removeEventListener("wheel", prevDefault);
      v.removeEventListener("wheel", onWheel);
    };
  }, [onWheel]);

  let prev_scale = useRef(0);
  useEffect(() => {
    const v = viewport.current!;
    const onGestureStart = (ev: any) => {
      ev.preventDefault();
      ev.stopPropagation();
      prev_scale.current = ev.scale;
    };
    const onGestureChange = (ev: any) => {
      ev.preventDefault();
      ev.stopPropagation();
      const grid_loc = client_to_grid([ev.clientX, ev.clientY]);
      const delta = (ev.scale - prev_scale.current) * 2;
      prev_scale.current = ev.scale;
      console.log(delta);
      performZoom2(grid_loc, delta);
    };

    v.addEventListener("gesturestart", onGestureStart);
    v.addEventListener("gesturechange", onGestureChange);
    return () => {
      v.removeEventListener("gesturestart", onGestureStart);
      v.removeEventListener("gesturechange", onGestureChange);
    };
  }, [client_to_grid, performZoom2, scale]);

  useLayoutEffect(() => {
    const rect = viewport.current!.getBoundingClientRect();
    v_loc.current = {
      x: rect.x,
      y: rect.y,
    };
    const size_recorder = (dest: MutableRefObject<any>, name: string) =>
      new ResizeObserver((entries) => {
        const rect = entries.pop()!.contentRect;
        dest.current = {
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y,
        };
        console.log("RESIZE!" + name, dest.current);
        manualRender();
      });
    const v_observer = size_recorder(v_dim, "viewport");
    v_observer.observe(viewport.current!);
    const c_observer = size_recorder(c_dim, "canvas");
    c_observer.observe(canvas.current!);
    console.log("Canvas: ", canvas.current!);
    return () => {
      v_observer.disconnect();
      c_observer.disconnect();
    };
  }, []);

  return (
    <div
      className="viewport"
      ref={viewport}
      style={{
        overflow: "auto",
        position: "relative",
        touchAction: "pan-x pan-y",
      }}
    >
      <div
        className="gridsvg"
        ref={canvas}
        style={{
          position: "absolute",
          fontSize: "1in",
          transform: `translate(${offset.current[0]}px, ${offset.current[1]}px) scale(${scale})`,
          transformOrigin: "0 0",
          transition: "transform",
          overflow: "visible"
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export const Viewport = memo(forwardRef(ViewportElem));
