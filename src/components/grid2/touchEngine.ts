import { Coord } from "./util"
import { useState, useCallback, RefObject } from "react";

// export interface Pointer<S> {
//     kind: 'touch' | 'pen' | 'mouse',
//     location: Coord<S>,
//     isPrimary: boolean,
//     id: number,
// }

// export interface PointerState<S> {
//     pointers: Pointer<S>[],
// }

// function getPointer<S>(ev: PointerEvent): Pointer<S> {
//     // @ts-ignore
//     let rect = ev.target!.getBoundingClientRect();
//     return {
//         kind: ev.pointerType as any,
//         location: [ev.clientX - rect.x, ev.clientY - rect.y],
//         isPrimary: ev.isPrimary,
//         id: ev.pointerId,
//     }
// }

// export function useTouchEngine<S>(mount: RefObject<HTMLElement>, ) {
//     const [pointers, setPointers] = useState<PointerState<S>>({
//         pointers: [],
//     });

//     return {
//         onPointerDown: (ev: PointerEvent) => {
//             setPointers((ps) => ({
//                 pointers: [...ps.pointers, getPointer(ev)],
//             }))
//         },
//         onPointerUp: (ev: PointerEvent) => {
//             setPointers((ps) => ({
//                 pointers: ps.pointers.filter(p => p.id != ev.pointerId),
//             }))
//         },
//         onPointerMove: (ev: PointerEvent) => {
//             setPointers((ps) => ({
//                 pointers: ps.pointers.map(p => {
//                     if (p.id === ev.pointerId) {
//                         return getPointer(ev);
//                     } else {
//                         return p;
//                     }
//                 }),
//             }))
//         },
//     }
// }

function useTouchEngine(viewport: RefObject<HTMLDivElement>, canvas: RefObject<SVGSVGElement>) {

}