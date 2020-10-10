import React, {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import { Coord, GridSpace, sub } from "../../modules/game/units";
import { usePinch } from "../util/usePinch";

export interface ViewportProps {
  overlay?: ReactNode;
}

const min_scale = 0.1;
const max_scale = 2;
const scroll_factor = 0.06;
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
  const translater = useRef<HTMLDivElement>(null);
  const scaler = useRef<HTMLDivElement>(null);

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
    translater.current!.style.transform = `translate(${offset.current[0]}px, ${offset.current[1]}px)`;
    translater.current!.style.fontSize = scale.current + "in";
    scaler.current!.style.transform = `scale(${scale.current})`;
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

  useLayoutEffect(() => {
    const vp = viewport.current!;
    const down = (ev: KeyboardEvent) => {
      console.log("huh....");
      if (ev.ctrlKey) {
        vp.classList.add("control");
      } else {
        vp.classList.remove("control");
      }
    };
    document.addEventListener("keydown", down);
    document.addEventListener("keyup", down);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", down);
    };
  });

  let prev_scale = useRef(0);
  usePinch(viewport, {
    onPinchStart(ev) {
      ev.preventDefault();
      prev_scale.current = ev.scale;
    },
    onPinch(ev) {
      ev.preventDefault();
      const grid_loc = client_to_grid(ev.clientOrigin);
      const delta = (ev.scale - prev_scale.current) * 1.25;
      prev_scale.current = ev.scale;
      console.log(delta);
      performZoom2(grid_loc, delta);
    },
  });

  useEffect(() => {
    let drag_start = [0, 0];
    const vp = viewport.current!;
    const start = (ev: PointerEvent) => {
      if (ev.ctrlKey) {
        vp.setPointerCapture(ev.pointerId);
        ev.preventDefault();
        ev.stopPropagation();
        drag_start = [ev.clientX, ev.clientY];
      }
    };
    const move = (ev: PointerEvent) => {
      if (ev.ctrlKey && ev.buttons === 1) {
        ev.preventDefault();
        ev.stopPropagation();
        viewport.current!.scrollBy(
          ...(sub(drag_start as any, [ev.clientX, ev.clientY] as any) as any)
        );
        drag_start = [ev.clientX, ev.clientY];
      }
    };
    vp.addEventListener("pointerdown", start, { passive: false });
    vp.addEventListener("pointermove", move, { passive: false });
    return () => {
      vp.removeEventListener("pointerdown", start);
      vp.removeEventListener("pointermove", move);
    };
  });

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
    c_observer.observe(scaler.current!);
    console.log("Canvas: ", scaler.current!);
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
      onContextMenu={(ev) => ev.preventDefault()}
    >
      <div
        ref={translater}
        style={{
          position: "absolute",
          transform: `translate(${offset.current[0]}px, ${offset.current[1]}px)`,
          fontSize: scale.current + "in",
        }}
      >
        <div
          className="gridsvg"
          ref={scaler}
          style={{
            position: "absolute",
            fontSize: "1in",
            transform: `scale(${scale}) translateZ(0)`,
            transformOrigin: "0 0",
            transition: "transform",
            overflow: "visible",
          }}
        >
          {props.children}
        </div>
        {props.overlay}
      </div>
    </div>
  );
};

export const Viewport = memo(forwardRef(ViewportElem));
