import { combineReducers } from "redux";
import { gridReducer } from "./modules/grid";
export const rootReducer = combineReducers({
  grid: gridReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
