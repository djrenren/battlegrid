import { createSlice } from "@reduxjs/toolkit";
import { shared } from "../comms";
import { Coord, GridSpace, Offset } from "./units";

export type Image = {
  id: string,
  loc: Coord<GridSpace>,
  dim: Offset<GridSpace>,
  href: string
}


export const slice = createSlice({
  name: 'grid',
  initialState: {
    width: 15,
    height: 10,
    images: {} as { [id: string]: Image},
  },
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
    })
  }
})

export default slice.reducer;
export let { setDimensions, addImage, updateImage } = slice.actions;