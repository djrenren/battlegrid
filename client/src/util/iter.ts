export const first = <T>(iter: Iterable<T>): T | undefined => iter[Symbol.iterator]().next().value;
