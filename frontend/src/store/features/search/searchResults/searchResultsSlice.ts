import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchHistory, fetchSearchResults } from "./thunks";
import { SearchResultsState } from "./types";

const initialState: SearchResultsState = {
  results: [],
  meta: null,
  isLoading: false,
  error: null,
  searchHistory: [],
  currentQuery: "",
};

const searchResultsSlice = createSlice({
  name: "searchResults",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.results;
        state.meta = action.payload.meta;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.searchHistory = action.payload;
      });
  },
});

export const { setSearchTerm } = searchResultsSlice.actions;

export default searchResultsSlice.reducer;
