// src/redux/slices/userProfileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Base URL for your backend API
const API_BASE_URL = 'http://localhost:5000'; // Adjust as needed

// Thunk to fetch the current user's profile
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const username = auth.username;

      if (!username) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/users?name=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile.');
      }

      const data = await response.json();

      if (data.length === 0) {
        throw new Error('Profile not found.');
      }

      return data[0]; // Assuming usernames are unique
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to update the user's profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.userId;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to delete the user's account
export const deleteAccount = createAsyncThunk(
  'profile/deleteAccount',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.userId;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account.');
      }

      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state for the profile slice
const initialState = {
  profile: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Profile slice
const userProfileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Action to clear error and success messages
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.successMessage = 'Profile updated successfully.';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.profile = null;
        state.successMessage = 'Account deleted successfully.';
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearMessages } = userProfileSlice.actions;

export default userProfileSlice.reducer;
