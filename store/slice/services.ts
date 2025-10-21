import { privateApi } from "@/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface services {
  id: string;
  title: string;
  description: string;
  cost: string;
  image?: string;
  duration?: string;
  staffType?: string;
  rols?: string[];
}

interface UserState {
  services: services | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  services: null,
  isLoading: false,
  error: null,
};

export const getServices = createAsyncThunk(
  'user/getServices',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await privateApi.get(`services`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get services');
    }
  }
);


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
        state.error = null;
      })
      .addCase(getServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to get services';
      });
  },
});

export default userSlice.reducer;