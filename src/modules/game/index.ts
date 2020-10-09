import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { shared } from "../comms";
import { add, Coord, GridSpace, Offset } from "./units";

export type Image = {
  id: string;
  loc: Coord<GridSpace>;
  dim: Offset<GridSpace>;
  href: string;
};
export type GameState = typeof initialState;
let initialState = {
  id: "local",
  maps: [
    {
      width: 15,
      height: 10,
      images: {} as { [id: string]: Image },
    },
  ],
};
export let game = createSlice({
  name: "game",
  initialState: initialState as typeof initialState,
  reducers: {
    forkGame(state, action: { payload: string }) {
      state.id = action.payload;
    },
    loadGame(state, { payload }: { payload: GameState }) {
      return payload;
    },
    setDimensions: shared(
      (
        state: any,
        { payload }: { payload: { map: number; width: number; height: number } }
      ) => {
        const { map, width, height } = payload;
        state.maps[map].width = width;
        state.maps[map].height = height;
      }
    ),
    addImage: shared(
      (state: any, action: { payload: { map: number; img: Image } }) => {
        const { map, img } = action.payload;
        state.maps[map].images[img.id] = img;
      }
    ),
    updateImage: shared(
      (
        state: GameState,
        action: { payload: { map: number; id: string; img: Partial<Image> } }
      ) => {
        const { map, id, img } = action.payload;
        state.maps[map].images[id] = { ...state.maps[map].images[id], ...img };
      }
    ),
    moveImage: shared(
      (state: GameState,
        action: PayloadAction<{ map: number, id: string, offset: [number, number] }>) => {
        const { map, id, offset } = action.payload;
        state.maps[map].images[id].loc = add(state.maps[map].images[id].loc, offset as any) as any;
      }
    ),
    reset: shared(
      (state: any, action: { payload: any }) => (state = initialState)
    ),
  },
});

export default game.reducer;
export let {
  setDimensions,
  addImage,
  updateImage,
  reset,
  loadGame,
  forkGame,
  moveImage,
} = game.actions;
