import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
    fetchUsers,
    deleteUser,
    addUser,
    updateUser,
} from './userSlice'; // Adjust the import path accordingly

// Create a mock store for testing
const store = configureStore({
    reducer: {
        users: userReducer,
    },
});

describe('userSlice', () => {
    it('should handle fetchUsers.pending', () => {
        const initialState = { status: 'idle', error: null };
        const action = { type: fetchUsers.pending.type };

        const state = userReducer(initialState, action);
        expect(state.status).toBe('loading');
    });

    it('should handle fetchUsers.fulfilled', () => {
        const initialState = { users: [], status: 'loading', error: null };
        const action = {
            type: fetchUsers.fulfilled.type,
            payload: [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }],
        };

        const state = userReducer(initialState, action);
        expect(state.status).toBe('succeeded');
        expect(state.users).toEqual(action.payload);
    });

    it('should handle fetchUsers.rejected', () => {
        const initialState = { status: 'loading', error: null };
        const action = { type: fetchUsers.rejected.type, error: { message: 'Error' } };

        const state = userReducer(initialState, action);
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Error');
    });

    it('should handle deleteUser.fulfilled', () => {
        const initialState = {
            users: [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }],
        };
        const action = { type: deleteUser.fulfilled.type, payload: 1 };

        const state = userReducer(initialState, action);
        expect(state.users).toEqual([{ id: 2, name: 'Jane Doe' }]);
    });

    it('should handle deleteUser.rejected', () => {
        const initialState = { error: null };
        const action = { type: deleteUser.rejected.type, payload: 'Failed to delete' };

        const state = userReducer(initialState, action);
        expect(state.error).toBe('Failed to delete');
    });

    it('should handle addUser.fulfilled', () => {
        const initialState = { users: [], status: 'idle', error: null };
        const action = {
            type: addUser.fulfilled.type,
            payload: { id: 3, name: 'New User' },
        };

        const state = userReducer(initialState, action);
        expect(state.users).toContainEqual(action.payload);
    });

    it('should handle addUser.rejected', () => {
        const initialState = { users: [], error: null };
        const action = { type: addUser.rejected.type, payload: 'Failed to add user' };

        const state = userReducer(initialState, action);
        expect(state.error).toBe('Failed to add user');
    });

    it('should handle updateUser.fulfilled', () => {
        const initialState = {
            users: [{ id: 1, name: 'John Doe' }],
            status: 'idle',
            error: null,
        };
        const action = {
            type: updateUser.fulfilled.type,
            payload: { id: 1, name: 'Updated John Doe' },
        };

        const state = userReducer(initialState, action);
        expect(state.users[0].name).toBe('Updated John Doe');
    });

    it('should handle updateUser.rejected', () => {
        const initialState = { error: null };
        const action = { type: updateUser.rejected.type, payload: 'Failed to update user' };

        const state = userReducer(initialState, action);
        expect(state.error).toBe('Failed to update user');
    });
});
