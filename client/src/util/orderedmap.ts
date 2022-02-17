export class OrderedMap<K, V> {
  order: V[] = [];
  map: Map<K, number> = new Map();

  get(key: K): V | undefined {
    const idx = this.map.get(key);
    if (idx !== undefined) return this.order[idx];
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  add(key: K, value: V) {
    this.map.set(key, this.order.length);
    this.order.push(value);
  }

  delete(key: K): boolean {
    const idx = this.map.get(key);
    if (idx === undefined) return false;

    this.order.splice(idx, 1);
    this.map.delete(key);
    return true;
  }

  index(key: K): number | undefined {
    return this.map.get(key);
  }

  set_index(key: K, i: number): boolean {
    const idx = this.map.get(key);
    if (idx === undefined || i >= this.order.length) return false;
    const val = this.order.splice(idx, 1)[0];
    this.order.splice(i, 0, val);
    this.map.forEach((val, key) => {
      if (val >= i) {
        this.map.set(key, val + 1);
      }
    });
    this.map.set(key, i);
    return true;
  }

  values(): Iterable<V> {
    return this.order;
  }

  get size(): number {
    return this.map.size;
  }
}
