import { GameState } from ".";


export function gameState(id: string) {
  const item = sessionStorage.getItem(id);
  return item ? JSON.parse(item) : null;
}

export function persistState(id: string, state: GameState) {
  sessionStorage.setItem(id, JSON.stringify(state))
}