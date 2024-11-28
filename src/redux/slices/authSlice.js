import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:5000/users');
      const users = await response.json();

      const user = users.find(
        (u) => u.name === username && u.password === password
      );

      if (user) {
        Cookies.set('user', user.name, { expires: 7 });
        return user.name;
      } else {
        return thunkAPI.rejectWithValue('Invalid username or password');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Network error');
    }
  }
);

const initialState = {
  isAuth: false,
  username: '',
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuth = false;
      state.username = '';
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
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuth = true;
        state.username = action.payload;
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, setAuthFromCookie } = authSlice.actions;

export default authSlice.reducer;
