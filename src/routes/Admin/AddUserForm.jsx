import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';

const AddUserForm = ({ visible, onClose, onUserAdded }) => {
  const [loading, setLoading] = useState(false);

  // Form submit handler
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const newUser = await response.json();
        onUserAdded(newUser); // Call the parent method to update the user list
        message.success('User added successfully');
        onClose();
      } else {
        message.error('Failed to add user');
      }
    } catch (error) {
      message.error('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add User"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Username"
          rules={[{ required: true, message: 'Please input the username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input the email!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="isAdmin"
          label="Is Admin"
          rules={[{ required: true, message: 'Please select if the user is admin!' }]}
          initialValue={false}  // Default to non-admin
        >
          <Select>
            <Select.Option value={false}>No</Select.Option>
            <Select.Option value={true}>Yes</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="isManager"
          label="Is Manager"
          rules={[{ required: true, message: 'Please select if the user is manager!' }]}
          initialValue={false}  // Default to non-manager
        >
          <Select>
            <Select.Option value={false}>No</Select.Option>
            <Select.Option value={true}>Yes</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="profile.firstName"
          label="First Name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="profile.lastName"
          label="Last Name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="profile.address"
          label="Address"
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            Add User
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserForm;
