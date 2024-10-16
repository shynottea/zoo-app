// Login.js
import React, { useState } from 'react';
import { withAuth } from './withAuth';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';

const { Title } = Typography;

const PureLogin = ({ isAuth, login, logout, username }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { inputUsername, password } = values;
    setLoading(true);

    const success = await login(inputUsername, password);
    setLoading(false);

    if (success) {
      message.success(`Welcome, ${inputUsername}!`);
      navigate('/');
    } else {
      message.error('Invalid username or password');
    }
  };

  const handleLogout = () => {
    logout();
    message.info('Logged out successfully');
    navigate('/');
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
              <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
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
                      loading={loading}
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

export default withAuth(PureLogin);
