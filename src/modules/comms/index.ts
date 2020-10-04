import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "../../storage/session";
import { RootStore } from "../../store";
import { forkGame } from "../game";
import { playerJoined, removePlayer } from "../players";
import { syncAction } from "../sync";
import { issueToast } from "../toast";
import { game_client } from "./client2";
import { game_server, ServerClient } from "./server";

export let state = {
  conn: null as null | ServerClient,
};

export type ConnId = string & {
  _connId: "connid";
};

export const connect = createAsyncThunk(
  "comms/connect",
  async (gameId: string, { getState, dispatch }) => {
    const clientId = (getState() as RootStore).comms.clientId;
    try {
      state.conn = await game_client(gameId, clientId, {
        onMessage(m: any) {
          dispatch(m);
        },
        onDisconnect() {
          dispatch(comms.actions.disconnected());
        },
        onInitialMessage(m: any) {
          dispatch(m);
        },
        onConnect() {
          dispatch(comms.actions.connected());
        },
      });
      console.log("connected to server!");
    } catch (e) {
      dispatch(issueToast("joinFailure"));
      console.log(e);
      throw e;
    }
  }
);

export const host = createAsyncThunk(
  "comms/host",
  async (_: undefined, { getState, dispatch }) => {
    const clientId = (getState() as RootStore).comms.clientId;
    const server = await game_server(clientId, {
      onConnect(player) {
        server.sendTo(player, syncAction(getState() as any));
        dispatch(playerJoined(player));
      },
      onMessage(m) {
        dispatch(m);
      },
      onDisconnect(label) {
        dispatch(removePlayer(label));
      },
      onStartup() {
        dispatch(playerJoined(clientId));
      },
    });

    state.conn = server;
    Session.set("was_hosting", server.id);
    dispatch(forkGame(server.id));
    window.history.pushState(null, "", `?game=${server.id}`);
    return server.id;
  }
);

export let comms = createSlice({
  name: "comms",
  initialState: {
    // NOTE: offline denotes a totally offline game, not a disconnected state
    status: "offline" as "offline" | "pending" | "connected",
    hosting: false,
    clientId: Session.get("comms_id"),
    gameId: null as string | null,
  },
  reducers: {
    disconnected(state, action: {}) {
      state.status = "pending";
    },
    connected(state, action: {}) {
      state.status = "connected";
    },
  },
  extraReducers: (builder) => {
    // Client connection logic
    builder.addCase(connect.pending, (state, _) => {
      state.status = "pending";
    });
    builder.addCase(connect.fulfilled, (state, payload: any) => {
      state.gameId = payload.gameId;
      state.status = "connected";
    });
    builder.addCase(connect.rejected, (state, _) => {
      state.status = "offline";
    });

    // Hosting events
    builder.addCase(host.pending, (state, _) => {
      state.status = "pending";
    });
    builder.addCase(host.fulfilled, (state, { payload }) => {
      state.status = "connected";
      state.gameId = payload;
      state.hosting = true;
    });
    builder.addCase(host.rejected, (state, _) => {
      state.status = "offline";
    });
  },
});

export function shared<S, A>(
  f: (state: S, action: PayloadAction<A>) => void
): {
  reducer: (state: any, action: PayloadAction<A>) => void;
  prepare: (action: A) => any;
} {
  return {
    reducer: f as any,
    prepare: (a) => ({
      payload: a,
      meta: state.conn
        ? {
            shared: true,
            src: state.conn.id,
          }
        : {},
    }),
  };
}

export default comms.reducer;
