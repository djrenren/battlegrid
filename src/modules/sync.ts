import { RootStore } from "../store";

export function syncAction(state: RootStore) {
  return {
    type: "STATE_SYNC",
    payload: {
      game: state.game,
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
  };
}
