import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Session } from "../storage/session";
import { shared } from "./comms";

type PlayersState = { [id: string]: Player };
const initialState = {} as PlayersState;
export const players = createSlice({
  name: "players",
  initialState,
  reducers: {
    addPlayer: shared((state: PlayersState, action: { payload: Player }) => {
      state[action.payload.id] = action.payload;
    }),
    removePlayer: shared((state: PlayersState, action: { payload: string }) => {
      delete state[action.payload]
    })
  },
})

export default players.reducer;
export const { addPlayer, removePlayer } = players.actions;

export type Player = {
  name: string,
  id: string
}
