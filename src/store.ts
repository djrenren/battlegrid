import { configureStore } from '@reduxjs/toolkit'
import comms, {state} from './modules/comms'
import grid from './modules/grid'
import toast from './modules/toast'

const store = configureStore({
  reducer: {
    comms, grid, toast
  },
  middleware: m => [...m(), api => next => action => {
    state.conn && action.meta?.shared && action.meta?.src === state.conn?.id && state.conn.send(action);
    return next(action);
  }]
})

export default store;
export type RootStore = ReturnType<typeof store.getState>