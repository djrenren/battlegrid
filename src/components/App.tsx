import React, { useState } from "react";
import "./App.css";
import Grid from "./grid2/Grid";
import { connect, useSelector, useDispatch } from "react-redux";
import Toolbar from "./toolbar/Toolbar";
import { Offset } from "./grid2/util";
import { GridSpace } from "./grid2/Viewport";
import { RootStore } from "../store";
import { start_hosting } from "../modules/comms";
import { setDimensions } from "../modules/grid";
import { ToastArea } from "./toasts/ToastArea";
import { issueToast } from "../modules/toast";
import { useTranslation } from "react-i18next";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
function App() {
  let comms = useSelector((state: RootStore) => {
    console.log(state);
    return state.comms
  });
  let dim = useSelector((state: RootStore) => [state.grid.width, state.grid.height])
  let dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <div className="App">
      <ToastArea />
      <Grid dimensions={dim as Offset<GridSpace>} />
      <Toolbar>
        <button onClick={() => dispatch(setDimensions({width: dim[0] + 1, height: dim[1]}))}>Add Column</button>
        <button onClick={() => dispatch(setDimensions({width: dim[0], height: dim[1] + 1}))}>Add Row</button>
        <button onClick={() => dispatch(issueToast(t("hello")))}>Say hi</button>
        {!comms.connected && (
          <button onClick={() => dispatch(start_hosting())}>Host</button>
        )}

        {comms.hosting && `hosting: ${comms.gameId}`}
        {comms.connected &&
          !comms.hosting &&
          comms.players.map((p) => <span key={p}>{p}</span>)}
      </Toolbar>
    </div>
  );
}

export default App;
