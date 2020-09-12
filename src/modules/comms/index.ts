import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { Client } from "./client";
import { Server, ServerClient } from "./server";
import { issueToast } from "../toast";
import { syncAction } from "../sync";
import { PeerID } from "./peer";
import { loadGame } from "../game";
import { RootStore } from "../../store";

export let state = {
  conn: null as null | ServerClient
}

export type ConnId = string & {
  _connId: 'connid' 
} 

export const connect = createAsyncThunk('comms/connect', async (gameId: PeerID, { dispatch }) => {
  try {
    state.conn = await Client.create(gameId, {
      onMessage(m: any) {
        dispatch(m);
      },
      onDisconnect() {
        dispatch(comms.actions.disconnected())
      },
      onConnect(c) {
        dispatch(comms.actions.connected())
        console.log("connected to server!")
      }
    });
    return gameId;
  }
  catch(e) {
    dispatch(issueToast("joinFailure"));
    throw e;
  }
});

export const host = createAsyncThunk('comms/host', async (id: string | undefined, {getState, dispatch}) => {
  const server = await Server.create(id, {
    onConnect(label) {
      server.sendTo(label, syncAction(getState() as any))
    },
    onMessage(m) {
      dispatch(m);
    }
  })
  state.conn = server;
  dispatch(loadGame({
    ...(getState() as RootStore).game,
    id: server.id,
  }))
  sessionStorage.setItem("hosting", JSON.stringify([
    ...JSON.parse(sessionStorage.getItem("hosting") ?? "[]"),
    server.id
  ]));
  window.history.pushState({}, "", `?game=${server.id}`)
  return server.id;
});

export let comms = createSlice({
  name: 'comms',
  initialState: {
    status: 'offline' as 'offline' | 'pending' | 'connected',
    hosting: false,
    gameId: null as string | null,
  },
  reducers: {
    disconnected(state, action: {}) {
      state.status = "pending";
    },
    connected(state, action: {}) {
      state.status = "connected";
    }
  },
  extraReducers: builder => {
    // Client connection logic
    builder.addCase(connect.pending, (state, _) => {
      state.status = 'pending';
    })
    builder.addCase(connect.fulfilled, (state, { payload }) => {
      state.gameId = payload;
      state.status = 'connected'; 
    })
    builder.addCase(connect.rejected, (state, _) => {
      state.status = 'offline';
    })

    // Hosting events
    builder.addCase(host.pending, (state, _) => {
      state.status = 'pending';
    })
    builder.addCase(host.fulfilled, (state, {payload}) => {
      state.status = 'connected';
      state.gameId = payload;
      state.hosting = true;
    })
    builder.addCase(host.rejected, (state, _) => {
      state.status = 'offline';
    })
  }
})

export function shared<S, A>(f: (state: S, action: { payload: A }) => void): { reducer: typeof f, prepare: (action: A) => any }{
  return {
    reducer: f,
    prepare: a => ({
      payload: a,
      meta: state.conn ? {
        shared: true,
        src: state.conn.id
      } : {},
    })
  }
}

export default comms.reducer;