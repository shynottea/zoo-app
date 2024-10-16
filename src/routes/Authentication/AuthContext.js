import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = Cookies.get('user');
        if (user) {
            setIsAuth(true);
            setUsername(user);
        }
    }, []);

    const login = async (inputUsername, inputPassword) => {
        try {
            const response = await fetch('http://localhost:5000/users');
            const users = await response.json();

            const user = users.find(
                (u) => u.name === inputUsername && u.password === inputPassword
            );

            if (user) {
                setIsAuth(true);
                setUsername(user.name);
                Cookies.set('user', user.name, { expires: 7 });
                console.log('Login successful for user:', user.name);
                return true;
            } else {
                console.log('Invalid credentials');
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        setIsAuth(false);
        setUsername('');
        Cookies.remove('user');
        console.log('Logged out');
        navigate('/products', { replace: true });
    };

    return (
        <AuthContext.Provider value={{ isAuth, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
