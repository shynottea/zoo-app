import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/users';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
    throw new Error('Failed to fetch users');
    }
    return await response.json();
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId, thunkAPI) => {
    try {
    const response = await fetch(`${API_URL}/${userId}`, { method: 'DELETE' });
    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
    return userId; 
    } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
    }
});

export const addUser = createAsyncThunk('users/addUser', async (newUser, thunkAPI) => {
    try {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
    });
    if (!response.ok) {
        throw new Error('Failed to add user');
    }
    return await response.json(); 
    } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
    }
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ userId, userData }, thunkAPI) => {
    try {
        const response = await fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        });
        if (!response.ok) {
        throw new Error('Failed to update user');
        }
        return await response.json(); 
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const userSlice = createSlice({
name: 'users',
initialState: {
users: [],
status: 'idle', 
error: null,
},
reducers: {},
extraReducers: (builder) => {
builder
    .addCase(fetchUsers.pending, (state) => {
    state.status = 'loading';
    })
    .addCase(fetchUsers.fulfilled, (state, action) => {
    state.status = 'succeeded';
    state.users = action.payload;
    })
    .addCase(fetchUsers.rejected, (state, action) => {
    state.status = 'failed';
    state.error = action.error.message;
    })
    .addCase(deleteUser.fulfilled, (state, action) => {
    state.users = state.users.filter((user) => user.id !== action.payload);
    })
    .addCase(deleteUser.rejected, (state, action) => {
    state.error = action.payload;
    })
    .addCase(addUser.fulfilled, (state, action) => {
    state.users.push(action.payload);
    })
    .addCase(addUser.rejected, (state, action) => {
    state.error = action.payload;
    })
    .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index >= 0) {
        state.users[index] = action.payload; 
        }
    })
    .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
    });
},
});

export default userSlice.reducer;
