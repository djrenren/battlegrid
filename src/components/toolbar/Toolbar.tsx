import React, { PropsWithChildren } from "react";
import { useDispatch, useSelector } from "react-redux";
import { host } from "../../modules/comms";
import { RootStore } from "../../store";
import { Loading } from "../toolkit/Loading";
import { Players } from "./Players";
import "./Toolbar.css";

interface ToolbarProps {}
function Toolbar(props: PropsWithChildren<ToolbarProps>) {
  let comms = useSelector((state: RootStore) => state.comms);
  let dispatch = useDispatch();
  return (
    <div className="toolbar">
      <div style={{}}>
        {comms.status === "offline" && (
          <button onClick={() => dispatch(host())}>Host</button>
        )}
        {comms.status === "pending" && <Loading />}

        {comms.hosting && <Players />}
      </div>
    </div>
  );
}
export default Toolbar;
