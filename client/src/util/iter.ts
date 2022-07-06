export const first = <T>(iter: Iterable<T>): T | undefined => iter[Symbol.iterator]().next().value;
export function* map<T, U>(iter: Iterable<T>, f: (item: T) => U): Iterable<U> {
  for (let item of iter) {
    yield f(item);
  }
}
