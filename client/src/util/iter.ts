export const first = <T>(iter: Iterable<T>): T | undefined => iter[Symbol.iterator]().next().value;
export function* map<T, U>(iter: Iterable<T>, f: (item: T) => U): Iterable<U> {
  for (let item of iter) {
    yield f(item);
  }
}

export function* filter<T>(iter: Iterable<T>, f: (item: T) => boolean): Iterable<T> {
  for (let item of iter) {
    if (f(item)) yield item;
  }
}
