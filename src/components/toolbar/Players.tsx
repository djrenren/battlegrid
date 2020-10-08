import React from "react";
import { FaUserFriends } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootStore } from "../../store";
export function Players() {
  const count = useSelector((store: RootStore) => store.players.online.length);
  return (
    <>
      <button>
        <FaUserFriends
          style={{ verticalAlign: "baseline", fontSize: "1.25em" }}
        />
        &nbsp;{count}&nbsp;
      </button>
    </>
  );
}
