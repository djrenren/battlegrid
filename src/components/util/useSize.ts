import { RefObject, useEffect, useState, useLayoutEffect } from "react";

export function useSize(ref: RefObject<HTMLElement>) {
    const [dim, setDim] = useState({ width: 0, height: 0 });
    const getSize = () => {
        let {width, height} = ref.current?.getBoundingClientRect()!;
        setDim({ width, height });
    }
    useEffect(() => {
        window.addEventListener('resize', getSize);
        return () => {
            window.removeEventListener('resize', getSize);
        }
    });
    return dim;
}