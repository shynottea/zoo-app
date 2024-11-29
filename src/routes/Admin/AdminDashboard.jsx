import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AddUserForm from './AddUserForm'; // Import the AddUser component

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const server = 'http://localhost:5000/users';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(server);
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await fetch(`http://localhost:5000/users/${userId}`, { method: 'DELETE' });
      setUsers(users.filter((user) => user.id !== userId));
      message.success('User deleted successfully');
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleAddUser = (newUser) => {
    // Add new user to the list
    setUsers([...users, newUser]);
  };

  const getUserRole = (user) => {
    if (user.isAdmin) return 'Admin';
    if (user.isManager) return 'Manager';
    return 'User';
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      render: (isAdmin) => (isAdmin ? 'Admin' : 'User'),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <span>
          <Button onClick={() => navigate(`/admin-dashboard/${record.id}`)} style={{ marginRight: 10 }}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => deleteUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Button
        type="primary"
        onClick={() => setShowAddUserModal(true)}
        style={{ marginBottom: 20 }}
      >
        Add New User
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={false}
      />
      <AddUserForm
        visible={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserAdded={handleAddUser}
      />
    </div>
  );
};

export default AdminDashboard;
