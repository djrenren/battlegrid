import React, {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Coord, GridSpace } from "../../modules/game/units";

export interface ViewportProps {
  baseScalar: number;
  baseUnit: string;
  height: number;
  width: number;
}

const min_scale = 0.5;
const max_scale = 2;
const scroll_factor = 0.07;
const scrollbar_px = 15;

export interface ViewportRef {
  clientToGrid(coord: [number, number]): Coord<GridSpace>;
}

function px(inch: number) {
  return inch * 96;
}

function inch(px: number) {
  return px / 96;
}

export const ViewportElem: ForwardRefRenderFunction<
  ViewportRef,
  PropsWithChildren<ViewportProps>
  > = (props, ref) => {
  const viewport = useRef<HTMLDivElement>(null);
  const [pending_scroll, set_ps] = useState<[number, number] | null>(null);
  const [scale, set_scale] = useState(1);
  const [v_dim, set_v_dim] = useState({
    width: 0,
    height: 0,
  });
  const offset = useMemo(() => {
    console.log(v_dim);
    return [
      Math.max(0, (v_dim.width - px(props.width) * scale) / 2),
      Math.max(0, (v_dim.height - px(props.height) * scale) / 2),
    ];
  }, [props.width, props.height, v_dim, scale]);

  const performZoom2 = useCallback(
    (grid_pos: [number, number], proposed_delta: number) => {
      const new_scale = Math.min(
        max_scale,
        Math.max(min_scale, scale + proposed_delta)
      );
      const delta = new_scale - scale;
      set_scale(new_scale);
      const left = viewport.current!.scrollLeft;
      const top = viewport.current!.scrollTop;
      set_ps([left + grid_pos[0] * delta, top + grid_pos[1] * delta]);
    },
    [scale]
  );

  const client_to_grid = useCallback(
    ([x, y]: [number, number]): [number, number] => {
      const vx = x + viewport.current!.scrollLeft;
      const vy = y + viewport.current!.scrollTop;
      return [(vx - offset[0]) / scale, (vy - offset[1]) / scale];
    },
    [offset, scale]
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
    (ev: React.WheelEvent) => {
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
    return () => {
     v.removeEventListener("wheel", prevDefault);
    }
  }, []);

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
      const delta = ev.scale - prev_scale.current;
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
    const viewport_handle = viewport.current!;
    const observer = new ResizeObserver((entries) => {
      const rect = entries.pop()!.contentRect;
      set_v_dim({
        width: rect.width,
        height: rect.height,
      });
    });
    observer.observe(viewport_handle);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (pending_scroll) {
      viewport.current!.scrollTo(...pending_scroll);
      set_ps(null);
    }
  }, [pending_scroll]);
    

  return (
    <div
      className="viewport"
      ref={viewport}
      style={{
        overflow: "scroll",
        position: "relative",
        touchAction: "pan-x pan-y"
      }}
      onWheel={onWheel}
    >
      <div
        className="gridsvg"
        style={{
          width: `${props.width}in`,
          height: `${props.height}in`,
          fontSize: "1in",
          position: "absolute",
          transform: `translate(${offset[0]}px, ${offset[1]}px) scale(${scale})`,
          transformOrigin: "0 0",
          overflow: "hidden",
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export const Viewport = memo(forwardRef(ViewportElem));
