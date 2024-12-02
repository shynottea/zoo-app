import React, { useEffect } from 'react';
import { Form, Input, Button, Select, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser } from '../../redux/slices/userSlice';

const EditUserProfile = ({ onUserUpdated }) => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, status, error } = useSelector((state) => state.users);
  const user = users.find((user) => user.id === userId);

  const [form] = Form.useForm();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const handleSubmit = async (values) => {
    const updatedUserData = {
      ...user,
      ...values,
      profile: {
        ...user?.profile,
        firstName: values['profile.firstName'],
        lastName: values['profile.lastName'],
        address: values['profile.address'],
      },
    };

    try {
      const updatedUser = await dispatch(updateUser({ userId, userData: updatedUserData })).unwrap();
      message.success('User updated successfully');
      dispatch(fetchUsers()); // Refresh user list
      onUserUpdated(updatedUser); // Trigger notification
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Failed to update user:', err);
      message.error(err || 'Failed to update user. Please try again.');
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (!user && status === 'succeeded') {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h2>Edit User</h2>
      <Form
        form={form}
        initialValues={{
          ...user,
          'profile.firstName': user?.profile?.firstName,
          'profile.lastName': user?.profile?.lastName,
          'profile.address': user?.profile?.address,
        }}
        onFinish={handleSubmit}
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
        <Form.Item label="First Name" name="profile.firstName">
          <Input />
        </Form.Item>
        <Form.Item label="Last Name" name="profile.lastName">
          <Input />
        </Form.Item>
        <Form.Item label="Address" name="profile.address">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Update User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUserProfile;
