import React, { useState, useEffect, useMemo, useCallback } from 'react';

const Login = () => {
  // Состояния для управления полями ввода
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Получаем данные о пользователе при загрузке компонента
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/users');
        const users = await response.json();

        // Проверяем, есть ли залогиненный пользователь
        const loggedUser = users.find((user) => user.isLoggedIn);
        if (loggedUser) {
          setUsername(loggedUser.username);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Ошибка при запросе:', error);
      }
    };

    fetchLoggedInUser();
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
      const response = await fetch('http://localhost:5000/users');
      const users = await response.json();

      const user = users.find(
          (user) => user.username === username && user.password === password
      );

      if (user) {
        setIsLoggedIn(true);
        setError('');

        // Обновляем статус залогиненности пользователя на сервере
        await fetch(`http://localhost:5000/users/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isLoggedIn: true }),
        });

        // Не перезагружаем страницу, а сохраняем состояние
      } else {
        setError('Неверное имя пользователя или пароль');
      }
    } catch (error) {
      console.error('Ошибка при запросе:', error);
      setError('Ошибка сервера');
    }
  }, [username, password]);

  // Обработчик выхода
  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/users');
      const users = await response.json();

      const loggedInUser = users.find((user) => user.isLoggedIn);

      if (loggedInUser) {
        // Обновляем статус залогиненности на сервере (выходим из аккаунта)
        await fetch(`http://localhost:5000/users/${loggedInUser.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isLoggedIn: false }),
        });

        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
        setError('');
      }
    } catch (error) {
      console.error('Ошибка при запросе:', error);
    }
  }, []);

  // Мемоизация приветственного сообщения
  const greetingMessage = useMemo(() => {
    return isLoggedIn ? `Добро пожаловать, ${username}!` : 'Вход';
  }, [isLoggedIn, username]);

  // Если пользователь вошел в систему, показываем кнопку "Выйти" и приветствие
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
                onChange={handleInputChange}
                required
            />
          </div>
          <div>
            <label>Пароль:</label>
            <input
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
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
