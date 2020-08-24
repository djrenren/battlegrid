import { PropsWithChildren } from "react";
import React from "react";
import "./Toolbar.css";

interface ToolbarProps {}
function Toolbar(props: PropsWithChildren<ToolbarProps>) {
    return (
        <div className="toolbar">
            {props.children}
        </div>);
}
export default Toolbar