import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Login from '../routes/Authentication/Login';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { login } from '../redux/slices/authSlice';
import { MemoryRouter } from 'react-router-dom';

const mockStore = configureStore([]);

describe('Login Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: { isAuth: false, username: '', status: 'idle', error: null },
        });
        store.dispatch = jest.fn();
    });

    test('renders login form', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test('dispatches login action on form submit', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </Provider>
        );

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(store.dispatch).toHaveBeenCalledWith(
                login({ username: 'testuser', password: 'password123' })
            );
        });
    });

    test('shows error message on failed login', async () => {
        store = mockStore({
            auth: { isAuth: false, username: '', status: 'failed', error: 'Invalid credentials' },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </Provider>
        );

        expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    });
});
