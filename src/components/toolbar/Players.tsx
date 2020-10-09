import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaUserFriends } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { issueToast } from "../../modules/toast";
import { RootStore } from "../../store";
export function Players() {
  const players = useSelector((store: RootStore) =>
    store.players.online.map((id) => store.players.data[id])
  );
  const [expanded, set_expanded] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    if (!expanded) return undefined;

    const handler = () => set_expanded(false);
    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, [expanded]);

  return (
    <div
      style={{
        position: "relative",
      }}
      onClick={
        expanded
          ? (ev) => {
              ev.stopPropagation();
            }
          : undefined
      }
    >
      <button
        onClick={() => set_expanded((e) => !e)}
        style={{
          borderBottomLeftRadius: expanded ? "0" : undefined,
          borderBottomRightRadius: expanded ? "0" : undefined,
          borderBottom: expanded ? "none" : undefined,
        }}
      >
        <FaUserFriends
          style={{ verticalAlign: "baseline", fontSize: "1.25em" }}
        />
        &nbsp;{players.length}&nbsp;
      </button>
      {expanded && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            background: "white",
            borderLeft: "1px solid gray",
            borderRight: "1px solid gray",
            borderBottom: "1px solid gray",
            borderTop: "1px solid gray",
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
            borderBottomLeftRadius: "5px",
            borderTopLeftRadius: "0",
          }}
        >
          {players.map((p) => (
            <div
              style={{
                padding: "0.2em",
              }}
            >
              {p.name}
            </div>
          ))}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              dispatch(issueToast(t("copied_to_clipboard")));
            }}
          >
            Copy Invite Link
          </button>
        </div>
      )}
    </div>
  );
}
