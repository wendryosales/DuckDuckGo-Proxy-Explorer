import { configureStore } from "@reduxjs/toolkit";
import highlightReducer from "./features/search/highlight/highlightSlice";
import searchResultsReducer from "./features/search/searchResults/searchResultsSlice";

export const store = configureStore({
  reducer: {
    searchResults: searchResultsReducer,
    highlight: highlightReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
