import React, { useState } from "react";
import "./App.css";
import Grid from "./components/grid2/Grid";
import { connect } from "react-redux";
import Toolbar from "./components/toolbar/Toolbar";
import { Offset } from "./components/grid2/util";
import { GridSpace } from "./components/grid2/Viewport";

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
  let [,setRect] = useState<Rect>({ x: 0, y: 0, width: 2, height: 2 });
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
    <div className="App">
      <Grid dimensions={[x,y] as Offset<GridSpace>} />
      {/* <Grid dimX={x} dimY={y}>
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
      </Grid> */}
      <Toolbar>
      <button
        onClick={click}
      >
        Add Rect
      </button>
      <button
        onClick={() => setX(x => x + 1)}
      >
        Add Column
      </button>
      <button
        onClick={() => setY(y => y + 1)}
      >
        Add Row 
      </button>

      </Toolbar>
    </div>
  );
});

export default App;
