import { RootStore } from "../store";

export function syncAction(state: RootStore) {
  return {
    type: "STATE_SYNC",
    payload: {
      grid: state.grid,
    },
  };
}

export function applySync(
  state: RootStore,
  action: ReturnType<typeof syncAction>
): RootStore {
  return {
    ...state,
    grid: action.payload.grid,
  };
}
