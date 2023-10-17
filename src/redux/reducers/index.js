import ThemeReducer from "./ThemeReducer";
import CategoryReducer from "./CategoryReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({ThemeReducer, CategoryReducer});

export default rootReducer