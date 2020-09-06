import { createSlice } from "@reduxjs/toolkit";
import { shared } from "../comms";
import { Coord, GridSpace, Offset } from "./units";

export type Image = {
  id: string,
  loc: Coord<GridSpace>,
  dim: Offset<GridSpace>,
  href: string
}

const initialState = {
  width: 15,
  height: 10,
  images: {} as { [id: string]: Image},
}
export const slice = createSlice({
  name: 'grid',
  initialState: initialState as typeof initialState,
  reducers: {
    setDimensions: shared((state: {width: number, height: number}, { payload }: { payload: { width: number, height: number } }) => {
        state.width = payload.width;
        state.height = payload.height;
    }),
    addImage: shared((state: any, action: { payload: Image }) => {
      state.images[action.payload.id] = action.payload;
    }),
    updateImage: shared((state: any, action: { payload: { id: string, img: Image } }) => {
      state.images[action.payload.id] = action.payload.img;
    }),
    reset: shared((state: any, action: {payload: any}) => state = initialState)
  }
})

export default slice.reducer;
export let { setDimensions, addImage, updateImage, reset } = slice.actions;