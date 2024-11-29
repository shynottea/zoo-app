// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Base URL for your backend API
const API_BASE_URL = 'http://localhost:5000'; // Adjust as needed

// Register a new user
export const register = createAsyncThunk(
  'auth/register',
  async ({ username, password, email }, thunkAPI) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, isAdmin: false, isManager: false })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
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
      const response = await fetch(`${API_BASE_URL}/users?name=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const users = await response.json();

      if (users.length === 0) {
        throw new Error('Invalid username or password');
      }

      const user = users[0];
      Cookies.set('user', user.name, { expires: 7 });
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Network error');
    }
  }
);

// Initial state
const initialState = {
  isAuth: false,
  username: '',
  userId: null, // Store user ID for profile fetching
  role: '', // 'admin', 'manager', 'user'
  status: 'idle',
  error: null,
  profile: null
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuth = false;
      state.username = '';
      state.userId = null;
      state.role = '';
      state.profile = null;
      Cookies.remove('user');
    },
    setAuthFromCookie(state, action) {
      const user = action.payload;
      if (user) {
        state.isAuth = true;
        state.username = user.name;
        state.userId = user.id;
        state.role = user.isAdmin ? 'admin' : user.isManager ? 'manager' : 'user';
        state.profile = user.profile || {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.fulfilled, (state, action) => {
        state.isAuth = true;
        state.username = action.payload.username;
        state.userId = action.payload.id;
        state.role = 'user'; // Default role is user
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Login
      .addCase(login.fulfilled, (state, action) => {
        state.isAuth = true;
        state.username = action.payload.name;
        state.userId = action.payload.id;
        state.role = action.payload.isAdmin ? 'admin' : action.payload.isManager ? 'manager' : 'user';
        state.profile = action.payload.profile || {};
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout, setAuthFromCookie } = authSlice.actions;

export default authSlice.reducer;
