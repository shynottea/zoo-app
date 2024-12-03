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
        // Step 1: Fetch the existing user data
        const getUserResponse = await fetch(`http://localhost:5000/users/${userId}`);
        if (!getUserResponse.ok) {
          throw new Error('Failed to fetch existing user data');
        }
        const existingUser = await getUserResponse.json();

        // Step 2: Merge the new profile data with the existing user data
        const updatedUser = {
          ...existingUser,
          profile: {
            ...existingUser.profile, // Keep existing profile fields
            ...profile,
          },
        };

        const updateResponse = await fetch(`http://localhost:5000/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update profile');
        }

        const updatedData = await updateResponse.json();
        return updatedData; // Return the updated user object
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Profile update failed');
      }
    }
);


const initialState = {
  isAuth: false,
  id: '',
  username: '',
  role: '',
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
      }
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(register.fulfilled, (state, action) => {
          state.isAuth = true;
          state.id = action.payload.id;
          state.username = action.payload.username;
          state.role = 'user';
          state.status = 'succeeded';
        })
        .addCase(register.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
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
        .addCase(updateProfile.fulfilled, (state, action) => {
          state.profile = action.payload.profile;
        });
  }
});

export const { logout, setAuthFromCookie } = authSlice.actions;

export default authSlice.reducer;