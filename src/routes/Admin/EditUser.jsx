import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const EditUserProfile = () => {
  const { userId } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`http://localhost:5000/users/${userId}`);
      const data = await response.json();
      setUser(data);
    };
    fetchUser();
  }, [userId]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        message.success('User updated successfully');
        navigate('/admin-dashboard'); // Redirect back to the admin dashboard
      } else {
        message.error('Failed to update user');
      }
    } catch (error) {
      message.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit User</h2>
      <Form
        initialValues={user}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Username"
          name="name"
          rules={[{ required: true, message: 'Please input the username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input the email!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Admin Role"
          name="isAdmin"
          rules={[{ required: true, message: 'Please select if the user is admin!' }]}
        >
          <Select>
            <Select.Option value={false}>No</Select.Option>
            <Select.Option value={true}>Yes</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Manager Role"
          name="isManager"
          rules={[{ required: true, message: 'Please select if the user is manager!' }]}
        >
          <Select>
            <Select.Option value={false}>No</Select.Option>
            <Select.Option value={true}>Yes</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="First Name"
          name="profile.firstName"
         
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="profile.lastName"
          
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Address"
          name="profile.address"
        
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            Update User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUserProfile;
