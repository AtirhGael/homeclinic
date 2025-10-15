import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Hospital Management Types
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  assignedDoctor?: string;
  ward?: string;
  admissionDate?: string;
  status: 'admitted' | 'outpatient' | 'discharged';
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  department: string;
  licenseNumber: string;
  yearsOfExperience: number;
  availableSlots: string[];
  patients: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  prescription?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  prescription: string[];
  followUpDate?: string;
  notes: string;
}

interface HospitalState {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HospitalState = {
  patients: [],
  doctors: [],
  appointments: [],
  medicalRecords: [],
  isLoading: false,
  error: null,
};

// Async thunks for hospital operations
export const fetchPatients = createAsyncThunk(
  'hospital/fetchPatients',
  async () => {
    // TODO: Replace with actual API call
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1234567890',
        dateOfBirth: '1990-01-15',
        address: '123 Main St, City, State',
        medicalHistory: ['Hypertension', 'Diabetes Type 2'],
        allergies: ['Penicillin'],
        currentMedications: ['Metformin', 'Lisinopril'],
        assignedDoctor: 'Dr. Smith',
        status: 'outpatient',
      },
    ];
    
    return mockPatients;
  }
);

export const fetchDoctors = createAsyncThunk(
  'hospital/fetchDoctors',
  async () => {
    // TODO: Replace with actual API call
    const mockDoctors: Doctor[] = [
      {
        id: '1',
        name: 'Dr. Sarah Smith',
        email: 'dr.smith@hospital.com',
        phone: '+1234567891',
        specialization: 'Internal Medicine',
        department: 'General Medicine',
        licenseNumber: 'MD123456',
        yearsOfExperience: 10,
        availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        patients: ['1'],
      },
    ];
    
    return mockDoctors;
  }
);

export const createAppointment = createAsyncThunk(
  'hospital/createAppointment',
  async (appointment: Omit<Appointment, 'id'>) => {
    // TODO: Replace with actual API call
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    
    return newAppointment;
  }
);

export const createMedicalRecord = createAsyncThunk(
  'hospital/createMedicalRecord',
  async (record: Omit<MedicalRecord, 'id'>) => {
    // TODO: Replace with actual API call
    const newRecord: MedicalRecord = {
      ...record,
      id: Date.now().toString(),
    };
    
    return newRecord;
  }
);

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updatePatient: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
    updateAppointmentStatus: (state, action: PayloadAction<{ id: string; status: Appointment['status'] }>) => {
      const appointment = state.appointments.find(a => a.id === action.payload.id);
      if (appointment) {
        appointment.status = action.payload.status;
      }
    },
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch Patients
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch patients';
      });

    // Fetch Doctors
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch doctors';
      });

    // Create Appointment
    builder
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create appointment';
      });

    // Create Medical Record
    builder
      .addCase(createMedicalRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMedicalRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicalRecords.push(action.payload);
      })
      .addCase(createMedicalRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create medical record';
      });
  },
});

export const { clearError, updatePatient, updateAppointmentStatus, addPatient } = hospitalSlice.actions;
export default hospitalSlice.reducer;