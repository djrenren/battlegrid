import { configureStore, combineReducers, Store, AnyAction, AsyncThunkAction } from '@reduxjs/toolkit'
import comms, {state} from './modules/comms'
import game from './modules/game'
import toast from './modules/toast'
import players from './modules/players'
import { applySync } from './modules/sync';
import { persistState } from './modules/game/persist';
import { Session } from './storage/session'

const mainReducer = combineReducers({ comms, game, toast, players });
export type RootStore = ReturnType<typeof mainReducer>;

const initialState: RootStore = mainReducer(undefined, { type: 'null' });

// This "any" means dispatch whatever you want. Works well enough
const store: Store<RootStore, any> = configureStore({
  reducer(state, action): ReturnType<typeof mainReducer> {
    if (action.type === 'STATE_SYNC') {
      return applySync(state!, action as any);
    }
    return mainReducer(state, action);
  },
  middleware: m => m().prepend(api => next => action => {
    // Send out all actions that originated on this peer
    // if we didn't check that it came from this peer, we'd
    // bounce messages back and forth forever
    console.log("connection?", state.conn);
    state.conn && action.meta?.shared && action.meta?.src === state.conn.id && state.conn.send(action);
    return next(action);
  }),
  preloadedState: initialState,
})

store.subscribe(() => {
  const state = store.getState() as RootStore;
  console.log(state);
  persistState(state.game.id, state.game);
  Session.set('players', state.players.data);
});
export default store;