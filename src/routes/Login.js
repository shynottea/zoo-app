import React, { useState, useEffect, useMemo, useCallback } from 'react';

const Login = () => {
  // Состояния для управления полями ввода
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Чтение данных из localStorage при первой загрузке компонента
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedLoggedInStatus = localStorage.getItem('isLoggedIn') === 'true';

    if (savedUsername && savedLoggedInStatus) {
      setUsername(savedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  // Обработчик ввода для полей
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  }, []);

  // Отправка формы (вход)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/users');
      const users = await response.json();

      const user = users.find(
          (user) => user.username === username && user.password === password
      );

      if (user) {
        setIsLoggedIn(true);
        setError('');

        // Сохраняем статус и имя пользователя в localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('isLoggedIn', 'true');

        // Перезагружаем страницу после успешного логина
        window.location.reload();
      } else {
        setError('Неверное имя пользователя или пароль');
      }
    } catch (error) {
      console.error('Ошибка при запросе:', error);
      setError('Ошибка сервера');
    }
  }, [username, password]);

  // Обработчик выхода
  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setError('');

    // Удаляем данные из localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');

    // Перезагружаем страницу после логаута
    window.location.reload();
  }, []);

  // Мемоизация приветственного сообщения
  const greetingMessage = useMemo(() => {
    return isLoggedIn ? `Добро пожаловать, ${username}!` : 'Вход';
  }, [isLoggedIn, username]);

  // Если пользователь вошел в систему, показываем кнопку "Выйти"
  if (isLoggedIn) {
    return (
        <div>
          <header>
            <h2>{greetingMessage}</h2>
            <button onClick={handleLogout}>Выйти</button>
          </header>
        </div>
    );
  }

  // Форма для входа
  return (
      <div>
        <h2>{greetingMessage}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Имя пользователя:</label>
            <input
                type="text"
                name="username"
                value={username}
                onChange={handleInputChange}  // Обработка изменения ввода
                required
            />
          </div>
          <div>
            <label>Пароль:</label>
            <input
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}  // Обработка изменения ввода
                required
            />
          </div>
          <button type="submit">Войти</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
  );
};

export default Login;
