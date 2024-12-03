import React from 'react';
import { Modal, Form, Input, Button, Checkbox, message } from 'antd';
import { useDispatch } from 'react-redux';
import { addUser, fetchUsers } from '../../redux/slices/userSlice';

const AddUserForm = ({ visible, onClose, onUserAdded }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    const newUser = {
      name: values.name,
      email: values.email,
      password: values.password,
      isAdmin: values.isAdmin || false,
      isManager: values.isManager || false,
    };

    try {
      const addedUser = await dispatch(addUser(newUser)).unwrap();
      message.success('User added successfully');
      dispatch(fetchUsers()); 
      form.resetFields();
      onClose();
      onUserAdded(addedUser); 
    } catch (error) {
      console.error('Failed to add user:', error);
      message.error('Failed to add user. Please try again.');
    }
  };

  return (
    <Modal
      title="Add New User"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
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
          <Input type="email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input the password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="isAdmin"
          valuePropName="checked"
        >
          <Checkbox>Admin Role</Checkbox>
        </Form.Item>
        <Form.Item
          name="isManager"
          valuePropName="checked"
        >
          <Checkbox>Manager Role</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Add User
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserForm;
