// src/redux/slices/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Register a new user
export const register = createAsyncThunk(
  'auth/register',
  async ({ username, password, email }, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, password, email, isAdmin: false, isManager: false }),
      });
      if (!response.ok) {
        throw new Error('Failed to register');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Login and validate user credentials
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:5000/users');
      const users = await response.json();

      const user = users.find(u => u.name === username && u.password === password);
      if (user) {
        Cookies.set('user', user.name, { expires: 7 });
        return user;
      } else {
        return thunkAPI.rejectWithValue('Invalid username or password');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Network error');
    }
  }
);

// Update User Profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, profile }, thunkAPI) => {
    try {
      // Fetch existing user data
      const getUserResponse = await fetch(`http://localhost:5000/users/${userId}`);
      if (!getUserResponse.ok) {
        throw new Error('Failed to fetch existing user data');
      }
      const existingUser = await getUserResponse.json();

      // Merge existing profile with new profile data
      const updatedUser = {
        ...existingUser,
        profile: {
          ...existingUser.profile,
          ...profile,
        },
      };

      // Update user data
      const updateResponse = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await updateResponse.json();
      return updatedData; // Return updated user data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Profile update failed');
    }
  }
);

const initialState = {
  isAuth: false,
  id: '',
  username: '',
  role: '', // 'admin', 'manager', 'user'
  status: 'idle',
  error: null,
  profile: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuth = false;
      state.id = '';
      state.username = '';
      state.role = '';
      state.profile = null;
      Cookies.remove('user');
    },
    setAuthFromCookie(state) {
      const user = Cookies.get('user');
      if (user) {
        state.isAuth = true;
        state.username = user;
        // Note: To fully populate user details, consider fetching user data here
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Register
      .addCase(register.fulfilled, (state, action) => {
        state.isAuth = true;
        state.id = action.payload.id;
        state.username = action.payload.name;
        state.role = 'user'; // Default role after registration
        state.status = 'succeeded';
        state.profile = action.payload.profile || {};
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle Login
      .addCase(login.fulfilled, (state, action) => {
        state.isAuth = true;
        state.id = action.payload.id;
        state.username = action.payload.name;
        state.role = action.payload.isAdmin ? 'admin' : action.payload.isManager ? 'manager' : 'user';
        state.profile = action.payload.profile || {};
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload.profile;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, setAuthFromCookie } = authSlice.actions;

export default authSlice.reducer;
