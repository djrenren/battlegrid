import { v4 as uuid } from "uuid"

// Provides a strongly-typed interface to our session variables 

const defaults = {
  // Denotes whether the user is currently hosting
  was_hosting: () => null as null | string,
  // Denote the session-specific comms_id
  comms_id: uuid,
  // The most recently entered player name
  player_name: () => null as null | string,
  // game data
  game: () => null,
}

type SessionMap = typeof defaults;
export const Session = {
  get<K extends keyof SessionMap>(key: K): ReturnType<SessionMap[K]> {
    const item = sessionStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }

    const def = defaults[key]() as ReturnType<SessionMap[K]>;
    sessionStorage.setItem(key, JSON.stringify(def));
    return def;
  },

  set<K extends keyof SessionMap>(key: K, v: ReturnType<SessionMap[K]>) {
    sessionStorage.setItem(key, JSON.stringify(v))
  }
}