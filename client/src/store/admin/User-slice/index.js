import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  userList: [],
};

export const getAllUser = createAsyncThunk(
  "users/getAllUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users/getAll`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const makeAdmin = createAsyncThunk(
  "users/makeAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users/${id}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const adminUserSlice = createSlice({
  name: "adminUserSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.isLoading = false;
        state.userList = [];
      })
      .addCase(makeAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(makeAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(makeAdmin.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

// Export the reducer to include in the store
export default adminUserSlice.reducer;
