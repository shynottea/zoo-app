// withAuth.js
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Higher-order component to inject authentication context
export const withAuth = (WrappedComponent) => (props) => {
    const { isAuth, username, login, logout } = useContext(AuthContext);

    return (
        <WrappedComponent
            isAuth={isAuth}
            username={username}
            login={login}
            logout={logout}
            {...props}
        />
    );
};
