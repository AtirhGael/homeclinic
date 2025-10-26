import { privateApi } from "@/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
  phone?: string;
  whatsappNum?: string;
  about?: string;
  profilePicture?: string;
  photos?: string[];
  address?: string;
  location?: string;
  balance?: number;
  totalIn?: number;
  totalOut?: number;
  botEngagement?: string;
  organization?: string;
  password?: string;
  MedDetails?: any[];
  isVerified?: boolean;
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
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
  }
);
export const getNStaffs = createAsyncThunk(
  'user/getNStaffs',
  async (qty: number, { rejectWithValue }) => {
    try {
      const response = await privateApi.post("/get-n-staff", { qty });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response || 'Failed to get user');
    }
  }
);
export const updateUserById = createAsyncThunk(
  'user/updateUser',
  async (userData: User, { rejectWithValue }) => {
    try {
      const response = await privateApi.put(`users/${userData.id}`, userData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);
export const updateUserProfilePicture = createAsyncThunk(
  'user/updateUserProfilePicture',
  async (userData: User, { rejectWithValue }) => {
    try {
      const response = await privateApi.put(`users/profile-pic/${userData.id}`, userData.profilePicture);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'user/getall',
  async (userdata: User, {rejectWithValue}) => {
    try {
      const response = await privateApi.get('/users');
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Failed to get all users');
    }
  }
)

export const deleteUserById = createAsyncThunk(
  'user/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await privateApi.delete(`users/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
)

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
        state.user = action.payload;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to get user';
      }) 
      .addCase(updateUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to update user';
      })
      .addCase(updateUserProfilePicture.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfilePicture.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to update profile picture';
      });
  },
});

export const { clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;