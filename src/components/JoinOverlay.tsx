import { Dispatch } from "@reduxjs/toolkit";
import React, { FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPlayer, setLocalPlayer } from "../modules/players";
import { RootStore } from "../store";
import "./JoinOverlay.css"
import { Loading } from "./toolkit/Loading";
import { v4 as uuid } from "uuid";


export function JoinOverlay() {
  const shouldRender = useSelector((s: RootStore) => 
    (s.comms.gameId !== null || s.comms.status !== 'offline')
    && s.players.local === null
  );
  const connected = useSelector((s: RootStore) => s.comms.status === 'connected')
  const dispatch = useDispatch();

  if (!shouldRender) {
    return null;
  }

  const storedName = localStorage.getItem("storedPlayerName") ?? "";
  return (<div id="join">
    <form style={{
      display: "flex",
      flexDirection: "column",
      maxWidth: "480px"
    }} onSubmit={joinAsPlayer(dispatch)}>
      <label htmlFor="name">Display Name: 
      <input name="name" type="text" defaultValue={storedName}></input></label>
      {connected
        ? <button type="submit">Join</button>
        : <button type="submit" disabled>Connecting... <Loading /></button>
      }
    </form>
  </div>)
}

const joinAsPlayer = (dispatch: Dispatch<any>) => (ev: FormEvent) => {
  ev.preventDefault();
  const data = new FormData(ev.nativeEvent.target as HTMLFormElement);
  const name = data.get("name") as string;
  const id = uuid();
  localStorage.setItem("storedPlayerName", name);
  dispatch(addPlayer({name, id}));
  dispatch(setLocalPlayer(id));
}