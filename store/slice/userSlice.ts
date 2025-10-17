import { privateApi } from "@/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface User {
  id?: string;
  fullname: string;
  username: string;
  email: string;
  whatsappNum?: string;
  isVerified?: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const getUser = createAsyncThunk(
  'user/getUser',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await privateApi.get(`users/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to get user';
      });
  },
});

export const { clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;