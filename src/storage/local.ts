// Provides a strongly-typed interface to our local stored variables

const defaults = {
  dummy: () => true,
};

type LocalMap = typeof defaults;
export const Local = {
  get<K extends keyof LocalMap>(key: K): ReturnType<LocalMap[K]> {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }

    const def = defaults[key]() as ReturnType<LocalMap[K]>;
    localStorage.setItem(key, JSON.stringify(def));
    return def;
  },

  set<K extends keyof LocalMap>(key: K, v: ReturnType<LocalMap[K]>) {
    localStorage.setItem(key, JSON.stringify(v));
  },
};
