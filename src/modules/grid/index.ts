import { createSlice } from "@reduxjs/toolkit";
import { shared } from "../comms";

export const slice = createSlice({
  name: 'grid',
  initialState: {
    width: 15,
    height: 10,
  },
  reducers: {
    setDimensions: shared((state: {width: number, height: number}, { payload }: { payload: { width: number, height: number } }) => {
        state.width = payload.width;
        state.height = payload.height;
    })
  }
})

export default slice.reducer;
export const { setDimensions } = slice.actions;