import { RefObject, useEffect, useRef } from "react";
import { add, sub } from "../../modules/game/units";

type PinchEvent = {
  clientOrigin: [number, number];
  scale: number;
  preventDefault(): void;
}

type Touch = {
  id: number,
  coord: [number, number]
}

function calcState(touches: TouchList, touch1: number, touch2: number) {
  let found = null as [number, number] | null;
  for (let t of touches) {
    if (t.identifier === touch1 || t.identifier === touch2) {
      if (found === null) {
        found = [t.clientX, t.clientY];
        continue;
      }
      const found2 = [t.clientX, t.clientY];
      const diff = sub(found as any, found2 as any).map(Math.abs);
      const dist = Math.abs(diff[0] + diff[1])//Math.sqrt(diff[0] ** 2 + diff[1] ** 2);
      const center = add(found as any, found2 as any).map(n => n / 2) as [number, number];
      return { dist, center };
    }
  }
}

export function usePinch(target: RefObject<HTMLDivElement>, handlers: {
  onPinchStart(ev: PinchEvent): void
  onPinch(ev: PinchEvent): void
}) {
  const origin = useRef([0, 0] as [number, number]);
  const touch1 = useRef(null as number | null);
  const touch2 = useRef(null as number | null);
  const originalDist = useRef(0);
  useEffect(() => {
    const onTouchStart = (ev: TouchEvent) => {
      if (ev.touches.length === 1) {
        touch1.current = ev.touches[0].identifier
      }

      if (ev.touches.length === 2 && touch1.current !== null && touch2.current === null) {
        const touch = ev.touches[0].identifier === touch1.current ? ev.touches[1] : ev.touches[0];
        touch2.current = touch.identifier;

        const { center, dist } = calcState(ev.touches, touch1.current, touch2.current)!;
        origin.current = center;
        originalDist.current = dist;
        handlers.onPinchStart({
          clientOrigin: origin.current,
          scale: 1,
          preventDefault() {ev.preventDefault()}
        });
      }
    };

    const onTouchMove = (ev: TouchEvent) => {
      if (touch1.current === null || touch2.current === null) { return; }
      const { dist } = calcState(ev.touches, touch1.current, touch2.current)!;
      handlers.onPinch({
        clientOrigin: origin.current,
        scale: dist / originalDist.current,
        preventDefault() {ev.preventDefault()}
      })
    };

    const onTouchEnd = (ev: TouchEvent) => {
      let count = 0;
      for (let t of ev.touches)
        if (t.identifier === touch1.current || t.identifier === touch2.current) {
          count += 1;
        }
      if (count !== 2) {
        touch1.current = touch2.current = null;
      }
    }

    const opts = { passive: false };
    const target_curr = target.current;
    target_curr?.addEventListener('touchstart', onTouchStart, opts);
    target_curr?.addEventListener('touchend', onTouchEnd, opts);
    target_curr?.addEventListener('touchmove', onTouchMove, opts);
    return () => {
      target_curr?.removeEventListener('touchstart', onTouchStart);
      target_curr?.removeEventListener('touchend', onTouchEnd);
      target_curr?.removeEventListener('touchmove', onTouchMove);
    }
  })

}