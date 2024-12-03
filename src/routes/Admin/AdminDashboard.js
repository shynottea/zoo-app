import React, { useEffect } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser } from '../../redux/slices/userSlice';
import AddUserForm from './AddUserForm';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, status, error } = useSelector((state) => state.users);
  const [showAddUserModal, setShowAddUserModal] = React.useState(false);

  // Function to display system notifications
  const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/logo192.png', // Replace with your app's logo or icon
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, { body, icon: '/logo192.png' });
        }
      });
    }
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [status, dispatch]);

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId))
        .unwrap()
        .then(() => {
          message.success('User deleted successfully');
          showNotification('User Deleted', `User with ID ${userId} has been deleted.`);
        })
        .catch((error) => {
          message.error(`Failed to delete user: ${error}`);
        });
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
      render: (record) => {
        if (record.isAdmin) return 'Admin';
        if (record.isManager) return 'Manager';
        return 'User';
      },
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
              onConfirm={() => handleDeleteUser(record.id)}
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

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

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
        <Table columns={columns} dataSource={users} rowKey="id" pagination={false} />
        {showAddUserModal && (
            <AddUserForm
                visible={showAddUserModal}
                onClose={() => setShowAddUserModal(false)}
                onUserAdded={(user) => showNotification('User Added', `User ${user.name} has been added.`)}
            />
        )}
      </div>
  );
};

export default AdminDashboard;