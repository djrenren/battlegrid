import {
  MutableRefObject,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";

type Offset = [number, number];
let minZoom = 0.2;
let maxZoom = 2;

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

export function useNavigation(
  viewport: MutableRefObject<HTMLDivElement | null>,
  canvas: MutableRefObject<SVGSVGElement | null>,
  dimX: number,
  dimY: number
) {
  // We track performance critical state using refs and commit to react state manually
  let [scaleState, unsafeSetScale] = useState(1);
  let scale = useRef(scaleState);
  let [offsetState, unsafeSetOffset] = useState<Offset>([0, 0]);
  let offset = useRef(offsetState);

  // These setters keep the UI in sync with the instance variables
  let setOffset = useCallback(
    (o: Offset, apply?: boolean) => {
      console.log(o);
      o = [
        Math.min(
          canvas.current!.scrollWidth - viewport.current!.offsetWidth,
          Math.max(o[0], 0)
        ),
        Math.min(
          canvas.current!.scrollHeight - viewport.current!.offsetHeight,
          Math.max(o[1], 0)
        ),
      ];
      if (apply ?? true) {
        viewport.current!.scrollTo(o[0], o[1]);
      }
      offset.current = o;
    },
    [viewport, canvas, offset]
  );

  let setScale = useCallback(
    (s: number) => {
      canvas.current!.style.width = `${dimX * s}in`;
      canvas.current!.style.height = `${dimY * s}in`;
      scale.current = s;
    },
    [canvas, dimX, dimY]
  );

  let commitTransform = useCallback(() => {
    unsafeSetScale(scale.current);
    unsafeSetOffset(offset.current);
  }, [offset, scale]);

  // Does fancy math to zoom around a mouse location. Location given relative to viewport
  const performZoom = useCallback(
    (x: number, y: number, oldScale: number, newScale: number) => {
      const delta = clamp(newScale - oldScale, -0.05, 0.05);
      newScale = clamp(oldScale + delta, minZoom, maxZoom);
      if (newScale === oldScale) {
        return;
      }
      let left = ((x + offset.current[0]) * delta) / oldScale;
      let top = ((y + offset.current[1]) * delta) / oldScale;
      setScale(newScale);
      setOffset([offset.current[0] + left, offset.current[1] + top]);
    },
    [setScale, setOffset, offset]
  );
  const wheel = useCallback(
    (ev: any) => {
      if (ev.ctrlKey && canvas) {
        ev.preventDefault();
        let mouseX = ev.pageX - window.scrollX;
        let mouseY = ev.pageY - window.scrollY;
        let delta = -1 * ev.deltaY * 0.05 * scale.current;
        let newScale = scale.current + delta;
        performZoom(mouseX, mouseY, scale.current, newScale);
        commitTransform();
      }
    },
    [canvas, scale, commitTransform, performZoom]
  );

  useEffect(() => {
    const wasd = (ev: KeyboardEvent) => {
      switch (ev.key) {
        case "d":
          setOffset([
            offset.current[0] + 96 * scale.current,
            offset.current[1],
          ]);
          break;
        case "a":
          setOffset([
            offset.current[0] - 96 * scale.current,
            offset.current[1],
          ]);
          break;
        case "w":
          setOffset([
            offset.current[0],
            offset.current[1] - 96 * scale.current,
          ]);
          break;
        case "s":
          setOffset([
            offset.current[0],
            offset.current[1] + 96 * scale.current,
          ]);
          break;
        default:
          return;
      }
      commitTransform();
    };
    window.addEventListener("keydown", wasd);
    return () => {
      window.removeEventListener("keydown", wasd);
    };
  });

  useEffect(() => {
    const elem = viewport.current!;
    let prevX = 0;
    let prevY = 0;

    const down = (ev: PointerEvent) => {
      if (ev.pointerType === "mouse") {
        elem.setPointerCapture(ev.pointerId);
      }
      prevX = ev.clientX;
      prevY = ev.clientY;
    };
    elem.addEventListener("pointerdown", down);
    let ticking = false;
    const move = (ev: PointerEvent) => {
      if (ev.buttons === 1 && ev.pointerType === "mouse") {
        setOffset([
          offset.current[0] + prevX - ev.clientX,
          offset.current[1] + prevY - ev.clientY,
        ]);

        prevX = ev.clientX;
        prevY = ev.clientY;
      }
    };
    elem.addEventListener("pointermove", move);
    const up = (ev: PointerEvent) => {
      elem.releasePointerCapture(ev.pointerId);
      commitTransform();
    };
    elem.addEventListener("pointerup", up);
    return () => {
      elem.removeEventListener("pointerdown", down);
      elem.removeEventListener("pointermove", move);
      elem.removeEventListener("pointerup", up);
    };
  }, [setOffset, viewport, offset, commitTransform]);
  useEffect(() => {
    const elem = viewport.current!;

    const scroll = (ev: any) => {
      if (initialscale !== null) {
        return false;
      }
      setOffset(
        [viewport.current!.scrollLeft, viewport.current!.scrollTop],
        false
      );
      //setOffset([offset.current[0] + ev.deltaX, offset.current[1] + ev.deltaY], false)
      commitTransform();
    };

    let initialscale: number | null = null;
    // Use gesture events for iOS devices cuz it's smooooooth
    const startgesture = (ev: any) => {
      ev.preventDefault();
      console.log("Start Gesture");
      initialscale = scale.current;
    };
    const gesture = (ev: any) => {
      ev.preventDefault();
      console.log("Gesture");
      performZoom(
        ev.clientX,
        ev.clientY,
        scale.current,
        ev.scale * initialscale!
      );
      return false;
    };
    const endgesture = (ev: any) => {
      ev.preventDefault();
      initialscale = null;
      commitTransform();
      console.log("End Gesture");
      return false;
    };
    elem.addEventListener("gesturestart", startgesture);
    elem.addEventListener("gestureend", endgesture);
    elem.addEventListener("gesturechange", gesture);
    elem.addEventListener("wheel", wheel);
    elem.addEventListener("scroll", scroll);

    return () => {
      elem.removeEventListener("gesturestart", startgesture);
      elem.removeEventListener("gestureend", endgesture);
      elem.removeEventListener("gesturechange", gesture);
      elem.removeEventListener("wheel", wheel);
      elem.removeEventListener("scroll", scroll);
    };
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  useLayoutEffect(() => {
    setScale(scaleState);
    setOffset(offsetState);
  }, [dimX, dimY]);
  /* eslint-enable react-hooks/exhaustive-deps */
}
