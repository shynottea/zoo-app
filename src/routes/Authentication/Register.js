import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register, login } from '../../redux/slices/authSlice';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    const { username, password, email } = values;

    // Register the user
    dispatch(register({ username, password, email }))
      .unwrap()
      .then(() => {
        message.success('Registration successful!');
        dispatch(login({ username, password }));

        navigate('/products');
      })
      .catch((error) => {
        message.error('Registration failed: ' + error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '50px 20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Register</Title>
      <Form name="register-form" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
