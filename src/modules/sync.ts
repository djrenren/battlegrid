import { RootStore } from "../store";

export function syncAction(state: RootStore) {
  return {
    type: "STATE_SYNC",
    payload: {
      game: state.game,
      players: state.players
    },
  };
}

export function applySync(
  state: RootStore,
  action: ReturnType<typeof syncAction>
): RootStore {
  return {
    ...state,
    game: action.payload.game,
    players: action.payload.players
  };
}
