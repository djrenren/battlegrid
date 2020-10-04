import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "../storage/session";
import { shared } from "./comms";

type PlayersState = {
  online: string[],
  data: { [id: string]: Player }
};
const initialState = {
  online: [],
  data: Session.get('players'),
} as PlayersState;

export const players = createSlice({
  name: "players",
  initialState,
  reducers: {
    playerJoined: shared((state: PlayersState, action: PayloadAction<string>) => {
      state.online.push(action.payload);
      state.data[action.payload] = state.data[action.payload] || {
        name: null
      };
    }),
    removePlayer: shared((state: PlayersState, action: PayloadAction<string>) => {
      state.online = state.online.filter(p => p !== action.payload)
    }),
    changeName: shared((state: PlayersState, action: PayloadAction<{ player: string, name: string }>) => {
      state.data[action.payload.player].name = action.payload.name;
    })
  },
})

export default players.reducer;
export const {playerJoined, removePlayer, changeName} = players.actions;

export type Player = {
  name: string | null,
}
