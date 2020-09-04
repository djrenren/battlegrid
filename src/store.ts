import { configureStore, combineReducers } from '@reduxjs/toolkit'
import comms, {state} from './modules/comms'
import grid from './modules/grid'
import toast from './modules/toast'

console.log(comms);
const mainReducer = combineReducers({ comms, grid, toast });
const store = configureStore({
  reducer(state, action): ReturnType<typeof mainReducer> {
    if (action.type === 'STATE_SYNC') {
      return {
        ...state,
        grid: action.payload.grid
      }
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
  preloadedState: mainReducer(undefined, { type: 'null' }),
})


export default store;
export type RootStore = ReturnType<typeof mainReducer>