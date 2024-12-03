import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import { updateProfile } from '../../redux/slices/authSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { id, profile } = useSelector((state) => state.auth); // Access ID and profile
  const [form] = Form.useForm();

  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile);
    }
  }, [profile, form]);

  const onFinish = async (values) => {
    try {
      await dispatch(updateProfile({ userId: id, profile: values })).unwrap();
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Failed to update profile. Please try again.');
    }
  };

  return (
      <div>
        <h2>Your Profile</h2>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please enter your first name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please enter your last name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
              label="Address"
              name="address"
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
};

export default UserProfile;