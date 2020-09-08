import { configureStore, combineReducers } from '@reduxjs/toolkit'
import comms, {state} from './modules/comms'
import grid from './modules/grid'
import toast from './modules/toast'
import { applySync } from './modules/sync';

const mainReducer = combineReducers({ comms, grid, toast });
export type RootStore = ReturnType<typeof mainReducer>;

const storedState: RootStore = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')!) : null;
const initialState: RootStore = mainReducer(undefined, { type: 'null' });
if (storedState?.grid) {
  initialState.grid = storedState?.grid
}

const store = configureStore({
  reducer(state, action): ReturnType<typeof mainReducer> {
    if (action.type === 'STATE_SYNC') {
      return applySync(state, action as any);
    }
    return mainReducer(state, action);
  },
  middleware: m => [...m(), api => next => action => {
    // Send out all actions that originated on this peer
    // if we didn't check that it came from this peer, we'd
    // bounce messages back and forth forever
    state.conn && action.meta?.shared && action.meta?.src === state.conn?.id && state.conn.send(action);
    return next(action);
  }],
  preloadedState: initialState,
})

store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});
export default store;