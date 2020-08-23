import React, { useState } from "react";
import "./App.css";
import Grid from "./components/grid/Grid";
import { connect, useSelector } from "react-redux";
import { RootState } from "./redux";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
const App = connect()(function App() {
  let [rect, setRect] = useState<Rect>({ x: 0, y: 0, width: 2, height: 2 });
  let [x, setX] = useState(30);
  let [y, setY] = useState(30);
  const click = () => {
    setRect({
      x: getRandomInt(5),
      y: getRandomInt(5),
      width: getRandomInt(5) + 1,
      height: getRandomInt(5) + 1,
    });
  };
  return (
    <div className="full-height-container">
      <Grid dimX={x} dimY={y}>
        {
          <rect
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill="red"
          ></rect>
        }
        <rect x="10" y="10" width="10" height="10" fill="blue"></rect>
      </Grid>
      <button
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
        onClick={click}
      >
        Add Rect
      </button>
      <button
        style={{
          position: "absolute",
          top: 30,
          left: 0,
        }}
        onClick={() => setX(x => x + 1)}
      >
        Add Column
      </button>
      <button
        style={{
          position: "absolute",
          top: 60,
          left: 0,
        }}
        onClick={() => setY(y => y + 1)}
      >
        Add Row 
      </button>
    </div>
  );
});

export default App;
