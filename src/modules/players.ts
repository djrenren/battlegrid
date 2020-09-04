import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";


const players = createSlice({
  name: "players",
  initialState: {
    local: null as null | string,
    all: {} as {[id: string]: Player}
  },
  reducers: {}
})

type Player = {
  name: string | null,
  id: string
}
