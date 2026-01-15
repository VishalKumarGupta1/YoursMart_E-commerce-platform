import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResults: [],
};

export const getSearchResult = createAsyncThunk(
  "products/getSearchResult",
  async (keyword, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/shop/search/${keyword}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResult: (state) => {
      state.searchResults = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getSearchResult.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchResult.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(getSearchResult.rejected, (state, action) => {
        state.isLoading = false;
        state.searchResults = [];
      });
  },
});

export const { resetSearchResult } = searchSlice.actions;
// Export the reducer to include in the store
export default searchSlice.reducer;
