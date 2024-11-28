import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';

const { Title } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const { isAuth, username, status, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      message.success(`Welcome, ${username}!`);
      navigate('/');
    }
  }, [isAuth, username, navigate]);

  useEffect(() => {
    if (status === 'failed' && error) {
      message.error(error);
    }
  }, [status, error]);

  const onFinish = (values) => {
    const { inputUsername, password } = values;
    dispatch(login({ username: inputUsername, password }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '50px 20px' }}>
      {isAuth ? (
        <div style={{ textAlign: 'center' }}>
          <Title level={3}>Welcome, {username}!</Title>
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <div>
          <Title level={2} style={{ textAlign: 'center' }}>
            Login
          </Title>
          <Form name="login-form" onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Username"
              name="inputUsername"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={status === 'loading'}
                style={{ width: '100%' }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Login;
