import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HighlightPosition, TextHighlightState } from "./types";

const initialState: TextHighlightState = {
  highlightPattern: "",
  selectedMatch: {
    resultIndex: 0,
    matchIndex: 0,
  },
};

const textHighlightSlice = createSlice({
  name: "textHighlight",
  initialState,
  reducers: {
    setHighlightPattern: (state, action: PayloadAction<string>) => {
      state.highlightPattern = action.payload;
      state.selectedMatch = { resultIndex: 0, matchIndex: 0 };
    },
    setSelectedMatch: (state, action: PayloadAction<HighlightPosition>) => {
      state.selectedMatch = action.payload;
    },
  },
});

export const { setHighlightPattern, setSelectedMatch } =
  textHighlightSlice.actions;

export default textHighlightSlice.reducer;
