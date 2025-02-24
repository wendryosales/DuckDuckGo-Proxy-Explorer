import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface FetchSearchResultsParams {
  query: string;
  page?: number;
  perPage?: number;
}

export const fetchSearchResults = createAsyncThunk(
  "searchResults/fetchResults",
  async ({ query, page = 1, perPage = 10 }: FetchSearchResultsParams) => {
    try {
      const response = await axios.get(`/api/search`, {
        params: { q: query, page, perPage },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch results"
        );
      }
      throw error;
    }
  }
);
