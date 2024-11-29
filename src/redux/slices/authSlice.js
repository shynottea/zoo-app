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
        body: JSON.stringify({ username, password, email, isAdmin: false, isManager: false })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Registration failed');
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

// Profile Update (CRUD) for the user
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, profile }, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Profile update failed');
    }
  }
);

const initialState = {
  isAuth: false,
  username: '',
  role: '', // Added to track the user role (user, manager, admin)
  status: 'idle',
  error: null,
  profile: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuth = false;
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
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.isAuth = true;
        state.username = action.payload.username;
        state.role = 'user'; // Default role is user
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuth = true;
        state.username = action.payload.name;
        state.role = action.payload.isAdmin ? 'admin' : action.payload.isManager ? 'manager' : 'user';
        state.profile = action.payload.profile || {};
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload.profile;
      });
  }
});

export const { logout, setAuthFromCookie } = authSlice.actions;

export default authSlice.reducer;
