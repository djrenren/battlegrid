export class OrderedMap<K, V> {
  order: K[] = [];
  map: Map<K, V> = new Map();

  get(key: K): V | undefined {
    return this.map.get(key);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  add(key: K, value: V) {
    if (!this.map.has(key)) {
      this.map.set(key, value);
      this.order.push(key);
    } else {
      this.set_index(key, this.order.length - 1);
    }
  }

  delete(key: K): boolean {
    let value = this.map.get(key);
    if (value === undefined) return false;

    let res = this.map.delete(key);
    let idx = this.order.indexOf(key);
    if (idx === -1) {
      return res;
    }

    this.order.splice(idx, 1);
    return res;
  }

  index(key: K): number | undefined {
    return this.order.indexOf(key);
  }

  set_index(key: K, new_idx: number): boolean {
    const idx = this.order.indexOf(key);
    if (idx === -1) {
      return false;
    }

    this.order.splice(new_idx, 0, ...this.order.splice(idx, 1));

    return true;
  }

  *values(): Iterable<V> {
    for (let key of this.order) {
      yield this.map.get(key)!;
    }
  }

  get size(): number {
    return this.map.size;
  }
}
