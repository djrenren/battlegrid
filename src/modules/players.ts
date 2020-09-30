import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Session } from "../storage/session";
import { shared } from "./comms";

export const players = createSlice({
  name: "players",
  initialState: {
    local: null as null | string,
    others: {} as {[id: string]: Player}
  },
  reducers: {
    addPlayer: shared((state: any, action: { payload: Player }) => {
      state.all[action.payload.id] = action.payload;
    }),
    setLocalPlayer(state, action: { payload: string }) {
      state.local = action.payload
      Session.set('player_name', action.payload)
    }
  },
})

export default players.reducer;
export const { addPlayer, setLocalPlayer } = players.actions;

export type Player = {
  name: string,
  id: string
}
