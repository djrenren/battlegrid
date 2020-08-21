import React, { useEffect, useState, useRef, useLayoutEffect, PropsWithChildren } from "react";
import "./Grid.css"

let minZoom = .2;
let maxZoom = 5;
interface GridProps {
  initialZoom?: number;
  scrollX?: number;
  scrollY?: number;
  dimX: number;
  dimY: number;
}
function Grid(props: PropsWithChildren<GridProps>) {
  let ref = useRef<HTMLDivElement>(null);
  let svgRef = useRef<SVGSVGElement>(null);
  let currentZoom = 1;
  let initialZoom = currentZoom;

  const inToPixels = (inches: number) => inches * 96 * currentZoom

  // Does fancy math to zoom around a mouse location. Location given relative to viewport
  const performZoom = (x: number, y: number, delta: number) => {
    if (currentZoom + delta > maxZoom) {
      delta = maxZoom - currentZoom;
    } else if (currentZoom + delta < minZoom) {
      delta = minZoom - currentZoom;
    }
    let left = (x + ref.current!.scrollLeft) * delta / currentZoom;
    let top = (y + ref.current!.scrollTop) *delta / currentZoom;
    currentZoom += delta;
    svgRef!.current!.style.width = `${props.dimX * currentZoom}in`;
    svgRef!.current!.style.height = `${props.dimY * currentZoom}in`;
    ref!.current!.scrollLeft += left
    ref!.current!.scrollTop += top
  }

  let ticking = false;
  // FFX & Chrome emulate pinch to zoom as control + mousewheel
  const scroll = (ev: any) => {
    if (ev.ctrlKey && svgRef) {
      let x = ev.pageX - window.scrollX;
      let y = ev.pageY - window.scrollY;
      const delta = -1 * ev.deltaY * 0.05 * currentZoom;
      ev.preventDefault();
      if (!ticking) {
        window.requestAnimationFrame(function() {
          performZoom(x,y,delta);
          ticking = false;
        });
    
        ticking = true;
      } 
      console.log(ev.deltaMode)
    }
  };

  // Use gesture events for iOS devices cuz it's smooooooth
  const startgesture = (ev: any) => {
    ev.preventDefault();
    initialZoom = currentZoom;
  };
  const gesture = (ev: any) => {
    ev.preventDefault();
    performZoom(ev.clientX, ev.clientY, initialZoom * ev.scale - currentZoom);
  };
  const endgesture = (ev: any) => {
  };
  useLayoutEffect(() => {
    const elem = ref.current!;
    // elem.scrollLeft = inToPixels(props.scrollX ?? 0);
    // elem.scrollTop = inToPixels(props.scrollY ?? 0);
  })
  useLayoutEffect(() => {
    const elem = ref.current!;
    let mousedown = false;
    let initialScrollX = 0;
    let initialScrollY = 0;
    let initialMouseX = 0;
    let initialMouseY = 0;

    const down = (ev: MouseEvent) => {
      mousedown = true;
      initialScrollX = elem.scrollLeft;
      initialScrollY = elem.scrollTop;
      initialMouseX = ev.clientX
      initialMouseY = ev.clientY;
    }
    elem.addEventListener("mousedown", down);

    let ticking = false;
    const move = (ev: MouseEvent) => {
      if (ev.buttons === 1) {
        mousedown = true;
      }
      if (mousedown) {
        let [clientX, clientY] = [ev.clientX, ev.clientY];
        if (!ticking) {
          window.requestAnimationFrame(() => {
            elem.scrollLeft += (initialMouseX - ev.clientX);
            elem.scrollTop += (initialMouseY - ev.clientY);
            initialMouseX = ev.clientX;
            initialMouseY = ev.clientY;
            ticking = false;
          })
          ticking = true;
        }
      }
    }
    elem.addEventListener("mousemove", move);

    const disabledown = () => {
      mousedown = false;
    }
    elem.addEventListener("mouseup", disabledown);
    elem.addEventListener("mouseleave", disabledown);
    elem.addEventListener("mouseout", disabledown);
    return () => {
      elem.removeEventListener("mousedown", down);
      elem.removeEventListener("mousemove", move);
      elem.removeEventListener("mouseup", disabledown);
      elem.removeEventListener("mouseleave", disabledown);
      elem.removeEventListener("mouseout", disabledown);
    }
  })
  useLayoutEffect(() => {
    const elem = ref.current!;
    elem.addEventListener("gesturestart", startgesture);
    elem.addEventListener("gestureend", endgesture);
    elem.addEventListener("gesturechange", gesture);
    elem.addEventListener("wheel", scroll)
    return () => {
      elem.removeEventListener("gesturestart", startgesture);
      elem.removeEventListener("gestureend", endgesture);
      elem.removeEventListener("gesturechange", gesture);
      elem.removeEventListener("wheel", scroll)
    };
  });

  return (
    <div
      className="grid"
      style={{
        width: "100%",
        height: "100%",
        overflow: "scroll",
      }}
      ref={ref}
    >
      <svg
        viewBox={`0 0 ${props.dimX} ${props.dimY}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="gridsvg"
        style={{
          display: "block",
          position: "relative",
          //transition: "all 0.01s",
          //transitionTimingFunction: "ease-out",
          width: `${props.dimX * currentZoom}in`,
          height: `${props.dimY * currentZoom}in`,
          scrollBehavior: "auto"
        }}
        ref={svgRef}
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
        <rect width="200" height="200" fill="url(#grid)"></rect>
        {props.children}
      </svg>
    </div>
  );
}

export default Grid;
