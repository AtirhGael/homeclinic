import { privateApi } from "@/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface location{
    lat: number;
    lng: number;
    address: string;
}
interface appointment {
  userId: string;
  staffId: string;
  serviceId: string;
  type: string;
  date?: string;
  time?: string;
  location?: location;
  notes?: string;
}

interface AppointmentState {
  appointment: appointment | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointment: null,
  isLoading: false,
  error: null,
};

export const createAppointment = createAsyncThunk(
  'user/createAppointment',
  async (appointmentData: appointment, { rejectWithValue }) => {
    try {
      const response = await privateApi.post(`/appointments`, appointmentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create appointment');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointment = action.payload;
        state.error = null;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to create appointment';
      }) 
     
  },
});

export default userSlice.reducer;