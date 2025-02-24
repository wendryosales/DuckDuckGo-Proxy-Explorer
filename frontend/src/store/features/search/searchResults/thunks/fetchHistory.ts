import { getUserId } from "@/lib/user";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchHistory = createAsyncThunk(
  "searchResults/fetchHistory",
  async () => {
    try {
      const response = await axios.get(`/api/search/history`, {
        headers: {
          "x-user-id": getUserId(),
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch history"
        );
      }
      throw error;
    }
  }
);
