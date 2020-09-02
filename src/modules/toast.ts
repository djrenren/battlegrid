import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const sleep = (m: number) => new Promise(r => setTimeout(r, m))
export const issueToast = createAsyncThunk('toast/issue', async (msg: string, { dispatch }) => {
  const id = Date.now();
  dispatch(addToast({ id: Date.now(), msg }));
  await sleep(5000);
  dispatch(removeToast(id));
});

export const toast = createSlice({
  name: 'toast',
  initialState: {
    toasts: [] as { id: number, msg: string }[]
  },
  reducers: {
    addToast(state, { payload }: { payload: { id: number, msg: string } }) {
      state.toasts.push(payload);
    },
    removeToast(state, { payload }: { payload: number }) {
      state.toasts = state.toasts.filter(t => t.id !== payload)
    }
  }
})

export default toast.reducer;
export const { addToast, removeToast } = toast.actions;