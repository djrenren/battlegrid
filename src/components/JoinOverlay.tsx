import { Dispatch } from "@reduxjs/toolkit";
import React, { FormEvent, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeName } from "../modules/players";
import { RootStore } from "../store";
import "./JoinOverlay.css"


export function JoinOverlay() {
  const shouldRender = useSelector((s: RootStore) =>
    s.comms.status === "connected" && s.players.data[s.comms.clientId]?.name === null
  );

  const clientId = useSelector((s: RootStore) => s.comms.clientId);
  const dispatch = useDispatch();

  const joinAsPlayer = useCallback((ev: FormEvent) => {
    ev.preventDefault();
    const data = new FormData(ev.nativeEvent.target as HTMLFormElement);
    const name = data.get("name") as string;
    const player = { name, id: clientId };
    dispatch(changeName({ player: clientId, name }));
  }, [clientId, dispatch]);

  if (!shouldRender) {
    return null;
  }

  return (<div id="join">
    <form style={{
      display: "flex",
      flexDirection: "column",
      maxWidth: "480px",
      background: "red"
    }} onSubmit={joinAsPlayer}>
      <label htmlFor="name">Display Name: 
      <input name="name" type="text" defaultValue={""}></input></label>
      <button type="submit">Join</button>
    </form>
  </div>)
}