// src/routes/Admin/AddUserForm.jsx
import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const AddUserForm = ({ visible, onClose, onUserAdded }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const newUser = {
      name: values.name,
      email: values.email,
      password: values.password,
      isAdmin: values.isAdmin || false,
      isManager: values.isManager || false,
    };

    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const addedUser = await response.json();
      onUserAdded(addedUser);
      form.resetFields();
      onClose();
    } catch (error) {
      // If offline, the service worker will handle the retry
      console.error('Failed to add user:', error);
      alert('You are offline. The user will be added when you are back online.');
      form.resetFields();
      onClose();
    }
  };

  return (
    <Modal
      title="Add New User"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Username"
          rules={[{ required: true, message: 'Please input the username!' }]}
        >
          <Input />
        </Form.Item>
        {/* Add other fields like email, password, isAdmin, etc. */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add User
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserForm;
