import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
    register,
    login,
    updateProfile,
    logout,
    setAuthFromCookie
} from './authSlice'; // Adjust the import path accordingly
import Cookies from 'js-cookie';

// Mocking fetch to simulate network requests
global.fetch = jest.fn();

describe('authSlice', () => {
    let store;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                auth: authReducer,
            },
        });
        // Clear cookies before each test
        Cookies.remove('user');
        global.fetch.mockClear();
    });

    it('should handle register.fulfilled', async () => {
        const action = {
            type: register.fulfilled.type,
            payload: { id: 1, username: 'testuser', isAdmin: false, isManager: false },
        };

        const initialState = { ...store.getState().auth };
        store.dispatch(action);

        const state = store.getState().auth;
        expect(state.isAuth).toBe(true);
        expect(state.username).toBe('testuser');
        expect(state.role).toBe('user');
        expect(state.status).toBe('succeeded');
    });

    it('should handle register.rejected', async () => {
        const action = { type: register.rejected.type, payload: 'Registration failed' };

        const initialState = { ...store.getState().auth };
        store.dispatch(action);

        const state = store.getState().auth;
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Registration failed');
    });

    it('should handle login.fulfilled', async () => {
        const user = { id: 1, name: 'testuser', isAdmin: false, isManager: false, profile: {} };

        global.fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue([user]),
        });

        const action = {
            type: login.fulfilled.type,
            payload: user,
        };

        store.dispatch(action);
        const state = store.getState().auth;

        expect(state.isAuth).toBe(true);
        expect(state.username).toBe('testuser');
        expect(state.role).toBe('user');
        expect(state.status).toBe('succeeded');
    });

    it('should handle login.rejected', async () => {
        const action = { type: login.rejected.type, payload: 'Invalid username or password' };

        const initialState = { ...store.getState().auth };
        store.dispatch(action);

        const state = store.getState().auth;
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Invalid username or password');
    });

    it('should handle updateProfile.fulfilled', async () => {
        const action = {
            type: updateProfile.fulfilled.type,
            payload: { id: 1, profile: { bio: 'Updated bio' } },
        };

        const initialState = { ...store.getState().auth };
        store.dispatch(action);

        const state = store.getState().auth;
        expect(state.profile).toEqual({ bio: 'Updated bio' });
    });

    it('should handle logout', () => {
        // Set an initial authenticated state
        const initialState = {
            isAuth: true,
            id: 1,
            username: 'testuser',
            role: 'user',
            profile: { bio: 'Some bio' },
        };

        store.dispatch(logout());

        const state = store.getState().auth;
        expect(state.isAuth).toBe(false);
        expect(state.username).toBe('');
        expect(state.profile).toBeNull();
        expect(Cookies.get('user')).toBeUndefined(); // Cookie should be removed
    });

    it('should handle setAuthFromCookie (user exists in cookies)', () => {
        Cookies.set('user', 'testuser');
        store.dispatch(setAuthFromCookie());

        const state = store.getState().auth;
        expect(state.isAuth).toBe(true);
        expect(state.username).toBe('testuser');
    });

    it('should handle setAuthFromCookie (no user in cookies)', () => {
        Cookies.remove('user');
        store.dispatch(setAuthFromCookie());

        const state = store.getState().auth;
        expect(state.isAuth).toBe(false);
        expect(state.username).toBe('');
    });
});
