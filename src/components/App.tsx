import React from "react";
import "./App.css";
import Grid from "./grid2/Grid";
import { useSelector, useDispatch } from "react-redux";
import Toolbar from "./toolbar/Toolbar";
import { Offset, GridSpace } from "../modules/grid/units";
import { RootStore } from "../store";
import { host } from "../modules/comms";
import { setDimensions } from "../modules/grid";
import { ToastArea } from "./toasts/ToastArea";
import { issueToast } from "../modules/toast";
import { useTranslation } from "react-i18next";
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
        {comms.status === 'offline' && (
          <button onClick={() => dispatch(host())}>Host</button>
        )}
        {comms.status === 'pending' && (
          <Loading />
        )}

        {comms.hosting && `hosting: ${comms.gameId}`}
      </Toolbar>
    </div>
  );
}

export default App;
