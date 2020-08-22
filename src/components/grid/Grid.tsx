import React, { useEffect, useState, useRef, useLayoutEffect, PropsWithChildren, useCallback } from "react";
import "./Grid.css"
import { zoom } from "../../redux/modules/grid";

let minZoom = .2;
let maxZoom = 5;
interface GridProps {
  dimX: number;
  dimY: number;
}

interface Transform {
  zoom: number,
  scrollX: number,
  scrollY: number,
}

type Offset = [number, number];

function Grid(props: PropsWithChildren<GridProps>) {
  let ref = useRef<HTMLDivElement>(null);
  let svgRef = useRef<SVGSVGElement>(null);
  let commitRef = useRef<ReturnType<typeof setTimeout>>(null);

  // We track performance critical state using refs and commit manually
  let [scaleState, unsafeSetScale] = useState(1);
  let scale = useRef(scaleState);
  let [offsetState, unsafeSetOffset] = useState<Offset>([0, 0]);
  let offset = useRef(offsetState);

  // These setters keep the UI in sync with the instance variables
  let setOffset = useCallback((o: Offset, apply?: boolean) => {
    console.log(o)
    o = [
      Math.min(svgRef.current!.scrollWidth - ref.current!.offsetWidth, Math.max(o[0], 0)),
      Math.min(svgRef.current!.scrollHeight - ref.current!.offsetHeight, Math.max(o[1], 0))
    ]
    if (apply ?? true) {
      ref.current!.scrollTo(o[0], o[1]);
    }
    offset.current = o;
  }, [ref, svgRef, offset]);

  let setScale = useCallback((s: number) => {
    svgRef.current!.style.width = `${props.dimX * s}in`;
    svgRef.current!.style.height = `${props.dimY * s}in`;
    scale.current = s;
  }, [svgRef, props.dimX, props.dimY]);

  let commitTransform = useCallback(() => {
      unsafeSetScale(scale.current);
      unsafeSetOffset(offset.current);
  }, [offset, scale])


  // Does fancy math to zoom around a mouse location. Location given relative to viewport
  const performZoom = useCallback((x: number, y: number, oldScale: number, newScale: number) => {
    console.log(x, y, oldScale, newScale);
    newScale = Math.max(minZoom, Math.min(newScale, maxZoom));
    const delta = newScale - oldScale;
    let left = (x + offset.current[0]) * delta / oldScale;
    let top = (y + offset.current[1]) * delta / oldScale;
    setScale(newScale);
    setOffset([offset.current[0] + left, offset.current[1] + top]);
  }, [setScale, setOffset, offset])

  // FFX & Chrome emulate pinch to zoom as control + mousewheel
  const wheel = useCallback((ev: any) => {
    if (ev.ctrlKey && svgRef) {
      ev.preventDefault();
      let mouseX = ev.pageX - window.scrollX;
      let mouseY = ev.pageY - window.scrollY;
      let delta = -1 * ev.deltaY * 0.05 * scale.current;
      let newScale = scale.current + delta;
      performZoom(mouseX, mouseY, scale.current, newScale);
      commitTransform();
    }
  }, [ref, svgRef, scale, commitTransform, performZoom, setOffset]);

  const scroll = useCallback((ev: any) => {
    setOffset([ref.current!.scrollLeft, ref.current!.scrollTop], false)
    //setOffset([offset.current[0] + ev.deltaX, offset.current[1] + ev.deltaY], false)
    commitTransform()
  }, [setOffset, ref, commitTransform]);

  useEffect(() => {
    const wasd = (ev: KeyboardEvent) => {
      switch(ev.key) {
        case 'd':
          setOffset([offset.current[0] + 96 * scale.current, offset.current[1]]);
          break;
        case 'a':
          setOffset([offset.current[0] - 96 * scale.current, offset.current[1]]);
          break;
        case 'w':
          setOffset([offset.current[0], offset.current[1] - 96 * scale.current]);
          break;
        case 's':
          setOffset([offset.current[0], offset.current[1] + 96 * scale.current]);
          break;
        default:
          return;
      }
      commitTransform();
    }
    window.addEventListener("keydown", wasd);
    return () => {
      window.removeEventListener("keydown", wasd);
    }
  })


  useEffect(() => {
    const elem = ref.current!;
    let prevX = 0;
    let prevY = 0;

    const down = (ev: PointerEvent) => {
      if (ev.pointerType === "mouse") {
        elem.setPointerCapture(ev.pointerId)
      }
      prevX = ev.clientX
      prevY = ev.clientY;
    }
    elem.addEventListener("pointerdown", down);
    let ticking = false;
    const move = (ev: PointerEvent) => {
      if (ev.buttons === 1 && ev.pointerType === "mouse") {
        setOffset([
          offset.current[0] + prevX - ev.clientX,
          offset.current[1] + prevY - ev.clientY
        ])

        prevX = ev.clientX
        prevY = ev.clientY
      }
    }
    elem.addEventListener("pointermove", move);
    const up = (ev: PointerEvent) => {
      elem.releasePointerCapture(ev.pointerId)
      commitTransform();
    }
    elem.addEventListener("pointerup", up);
    return () => {
      elem.removeEventListener("pointerdown", down);
      elem.removeEventListener("pointermove", move);
      elem.removeEventListener("pointerup", up);
    }
  }, [setOffset, ref, offset, commitTransform])
  useEffect(() => {
    const elem = ref.current!;
    let initialscale = 1;
    // Use gesture events for iOS devices cuz it's smooooooth
    const startgesture = (ev: any) => {
      ev.preventDefault();
      initialscale = scale.current;
    };
    const gesture = (ev: any) => {
      ev.preventDefault();

      performZoom(ev.clientX, ev.clientY, scale.current, (ev.scale-1) + initialscale);
    };
    const endgesture = (ev: any) => {
      ev.preventDefault();
      commitTransform();
    };

    elem.addEventListener("gesturestart", startgesture);
    elem.addEventListener("gestureend", endgesture);
    elem.addEventListener("gesturechange", gesture);
    svgRef.current!.addEventListener("gesturestart", endgesture);
    elem.addEventListener("wheel", wheel)
    elem.addEventListener("scroll", scroll)

    let svgElem = svgRef.current!;
    return () => {
      elem.removeEventListener("gesturestart", startgesture);
      elem.removeEventListener("gestureend", endgesture);
      svgElem.removeEventListener("gesturestart", endgesture);
      elem.removeEventListener("gesturechange", gesture);
      elem.removeEventListener("wheel", wheel);
      elem.removeEventListener("scroll", scroll);
    };
  });

  useLayoutEffect(() => {
    setScale(scaleState);
    setOffset(offsetState);
  }, [props.dimX, props.dimY])

  return (
    <div
      className="grid"
      ref={ref}
    >
      <svg
        viewBox={`0 0 ${props.dimX} ${props.dimY}`}
        xmlns="http://www.w3.org/2000/svg"
        className="gridsvg"
        style={{
          display: "block",
          //transition: "all 0.01s",
          //transitionTimingFunction: "ease-out",
          background: "white",
          overflow: "hidden",
        }}
        ref={svgRef}
        overflow="hidden"
      >
        <defs>
          <pattern id="grid" width="1" height="1" patternUnits="userSpaceOnUse">
            <path
              d="M 1 0 L 0 0 0 1"
              fill="none"
              stroke="gray"
              strokeWidth="0.1"
            ></path>
          </pattern>
        </defs>
        <rect x=".1" y=".1" width={props.dimX-1} height={props.dimY-1} fill="url(#grid)"></rect>
        {props.children}
      </svg>
    </div>
  );
}

export default Grid;
