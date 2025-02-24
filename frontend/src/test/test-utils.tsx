import highlightReducer from "@/store/features/search/highlight/highlightSlice";
import { TextHighlightState } from "@/store/features/search/highlight/types";
import searchResultsReducer from "@/store/features/search/searchResults/searchResultsSlice";
import { SearchResultsState } from "@/store/features/search/searchResults/types";
import { store } from "@/store/store";
import { configureStore } from "@reduxjs/toolkit";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";

interface ExtendedRenderOptions {
  preloadedState?: {
    searchResults: SearchResultsState;
    highlight: TextHighlightState;
  };
  [key: string]: any;
}

function render(
  ui: React.ReactElement,
  { preloadedState, ...renderOptions }: ExtendedRenderOptions = {}
) {
  const testStore = preloadedState
    ? configureStore({
        reducer: {
          searchResults: searchResultsReducer,
          highlight: highlightReducer,
        },
        preloadedState,
      })
    : store;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={testStore}>{children}</Provider>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from "@testing-library/react";

export { render };
