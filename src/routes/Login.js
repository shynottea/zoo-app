// Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { isAuth, login, logout, username } = useContext(AuthContext);
  const [inputUsername, setInputUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await login(inputUsername, password);
    if (success) {
      setError('');
      navigate('/'); // Redirect after login
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
      <div>
        {isAuth ? (
            <div>
              <p>Welcome, {username}!</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
        ) : (
            <div>
              <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder="Username"
              />
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
              />
              <button onClick={handleLogin}>Login</button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        )}
      </div>
  );
};

export default Login;
