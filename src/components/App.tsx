import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { host } from "../modules/comms";
import { reset, setDimensions } from "../modules/game";
import { GridSpace, Offset } from "../modules/game/units";
import { issueToast } from "../modules/toast";
import { RootStore } from "../store";
import "./App.css";
import Grid from "./grid2/Grid";
import { JoinOverlay } from "./JoinOverlay";
import { ToastArea } from "./toasts/ToastArea";
import Toolbar from "./toolbar/Toolbar";
import { Loading } from "./toolkit/Loading";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function App() {
  let comms = useSelector((state: RootStore) => {
    console.log(state);
    return state.comms;
  });
  let [curr_map, _set_curr_map] = useState(() => 0);
  let dim = useSelector((state: RootStore) => [
    state.game.maps[curr_map].width,
    state.game.maps[curr_map].height,
  ]);
  let dispatch = useDispatch();
  const { t } = useTranslation();

  let players = useSelector((state: RootStore) =>
    state.players.online.map((p) => state.players.data[p].name)
  );
  return (
    <div className="App">
      <JoinOverlay />
      <ToastArea />
      <Grid dimensions={dim as Offset<GridSpace>} />
      <Toolbar>
        <button
          onClick={() =>
            dispatch(
              setDimensions({
                map: curr_map,
                width: dim[0] + 1,
                height: dim[1],
              })
            )
          }
        >
          Add Column
        </button>
        <button
          onClick={() =>
            dispatch(
              setDimensions({
                map: curr_map,
                width: dim[0],
                height: dim[1] + 1,
              })
            )
          }
        >
          Add Row
        </button>
        <button onClick={() => dispatch(reset({}))}>Reset</button>
        <button onClick={() => dispatch(issueToast(t("hello")))}>Say hi</button>
        {comms.status === "offline" && (
          <button onClick={() => dispatch(host())}>Host</button>
        )}
        {comms.status === "pending" && <Loading />}

        {comms.hosting && `hosting: ${comms.gameId}`}
        {players.map((p) => (
          <p>{p || "unknown"}</p>
        ))}
      </Toolbar>
    </div>
  );
}

export default App;
