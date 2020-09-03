import { configureStore } from '@reduxjs/toolkit'
import comms, {state} from './modules/comms'
import grid from './modules/grid'
import toast from './modules/toast'

const store = configureStore({
  reducer: {
    comms, grid, toast
  },
  middleware: m => [...m(), api => next => action => {
    ;
    state.host && state.host.broadcast_json(action);
    return next(action);
  }]
})

export default store;
export type RootStore = ReturnType<typeof store.getState>