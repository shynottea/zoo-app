// // src/routes/UserProfile/UserProfile.jsx
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProfile,clearMessages,updateProfile,deleteAccount } from '../../redux/slices/userProfileSlice';
// import { Form, Input, Button, Typography, message, Modal, Space } from 'antd';
// import { ExclamationCircleOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';

// const { Title } = Typography;
// const { confirm } = Modal;

// const UserProfile = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Select necessary state from Redux store
//   const { profile, loading, error, successMessage } = useSelector((state) => state.profile);
//   const { isAuth } = useSelector((state) => state.auth);

//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (isAuth && !profile) {
//       dispatch(fetchProfile());
//     }
//   }, [dispatch, isAuth, profile]);
  

//   useEffect(() => {
//     if (profile) {
//       form.setFieldsValue({
//         name: profile.name || '',
//         email: profile.email || '',
//         firstName: profile?.profile?.firstName || '',
//         lastName: profile?.profile?.lastName || '',
//         address: profile?.profile?.address || '',
//       });
//     }
//   }, [profile, form]);
  

//   useEffect(() => {
//     if (error) {
//       message.error(error);
//       dispatch(clearMessages());
//     }
//     if (successMessage) {
//       message.success(successMessage);
//       dispatch(clearMessages());
//       // Optionally, refetch profile after update
//       dispatch(fetchProfile());
//     }
//   }, [error, successMessage, dispatch]);

//   const onFinish = (values) => {
//     const updatedProfile = {
//       name: values.name, // Adjusted to 'name'
//       email: values.email,
//       profile: {
//         firstName: values.firstName,
//         lastName: values.lastName,
//         address: values.address,
//       },
//     };
//     dispatch(updateProfile(updatedProfile));
//   };

//   const showDeleteConfirm = () => {
//     confirm({
//       title: 'Are you sure you want to delete your account?',
//       icon: <ExclamationCircleOutlined />,
//       content: 'This action cannot be undone.',
//       okText: 'Yes, delete my account',
//       okType: 'danger',
//       cancelText: 'Cancel',
//       onOk() {
//         dispatch(deleteAccount()).then(() => {
//           message.success('Your account has been deleted.');
//           navigate('/signup'); // Redirect to signup or goodbye page
//         });
//       },
//       onCancel() {
//         // Do nothing on cancel
//       },
//     });
//   };

//   if (!isAuth) {
//     return <div>Please log in to view your profile.</div>;
//   }

//   return (
//     <div style={{
//       maxWidth: '600px',
//       margin: '40px auto',
//       padding: '20px',
//       background: '#fff',
//       borderRadius: '8px',
//       boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
//     }}>
//       <Title level={2} style={{ textAlign: 'center' }}>User Profile</Title>

//       {/* Profile Form */}
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={onFinish}
//         initialValues={{
//           name: '',
//           email: '',
//           firstName: '',
//           lastName: '',
//           address: '',
//         }}
//       >
//         <Form.Item
//           label="Username"
//           name="name"
//           rules={[{ required: true, message: 'Please input your username!' }]}
//         >
//           <Input disabled />
//         </Form.Item>

//         <Form.Item
//           label="Email"
//           name="email"
//           rules={[
//             { 
//               required: true, 
//               message: 'Please input your email!' 
//             },
//             { 
//               type: 'email', 
//               message: 'Please enter a valid email!' 
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="First Name"
//           name="firstName"
//           rules={[{ required: true, message: 'Please input your first name!' }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Last Name"
//           name="lastName"
//           rules={[{ required: true, message: 'Please input your last name!' }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Address"
//           name="address"
//           rules={[{ required: true, message: 'Please input your address!' }]}
//         >
//           <Input.TextArea rows={4} />
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
//             Update Profile
//           </Button>
//         </Form.Item>
//       </Form>

//       {/* Delete Account Button */}
//       <Space direction="vertical" style={{ width: '100%' }}>
//         <Button type="default" danger onClick={showDeleteConfirm} style={{ width: '100%' }}>
//           Delete Account
//         </Button>
//       </Space>
//     </div>
//   );
// };

// export default UserProfile;
