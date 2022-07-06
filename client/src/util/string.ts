export type Branded<K extends string> = string & {
  __brand: K;
};
