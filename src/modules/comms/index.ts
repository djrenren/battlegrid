import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { Client } from "./client";
import { Server } from "./server";
import { issueToast } from "../toast";

export const state = {
  client: null as Client | null,
  host: null as Server | null,

}

export type ConnId = string & {
  _connId: 'connid' 
} 

export const connect = createAsyncThunk('posts/fetchPosts', async (gameId: string, { dispatch }) => {
  try {
    state.client = await Client.connect(gameId, {
      onMessage(m: any) {
        dispatch(m);
      }
    });
    return gameId;
  }
  catch(e) {
    dispatch(issueToast("joinFailure"));
    throw e;
  }
});

export const start_hosting = createAsyncThunk('posts/fetchPosts', async (_: undefined, {dispatch}) => {
  state.host = await Server.create({
    onConnect(label) {
      dispatch(slice.actions.addPlayer(label))
    }
  })
  window.history.pushState({}, "", `?join=${state.host.id}`)
  return state.host.id;
});

export const slice = createSlice({
  name: 'conn',
  initialState: {
    connected: false,
    hosting: false,
    gameId: null as string | null,
    players: [] as ConnId[],
  },
  reducers: {
    addPlayer(state, { payload }) {
      state.players.push(payload)
    }
  },
  extraReducers: builder => {
    builder.addCase(connect.fulfilled, (state, { payload }) => {
      state.gameId = payload
      state.connected = true
    })
  }
})

export default slice.reducer;