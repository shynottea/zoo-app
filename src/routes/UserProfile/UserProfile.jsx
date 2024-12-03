// src/components/UserProfile.js

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, message, List, Typography, Spin, Card, Descriptions, Divider, Collapse, Pagination } from 'antd';
import { updateProfile } from '../../redux/slices/authSlice';
import { fetchUserOrders, setPage } from '../../redux/slices/orderSlice';
import { formatCurrency } from '../../utils/formatCurrency'; // Utility function to format price

const { Title, Text } = Typography;
const { Panel } = Collapse;

const UserProfile = () => {
  const dispatch = useDispatch();
  const { id, profile } = useSelector((state) => state.auth);
  const { orders, currentPage, pageSize, totalOrders, status: ordersStatus, error: ordersError } = useSelector((state) => state.orders);
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);

  const [profileVisible, setProfileVisible] = useState(false);
  const [ordersVisible, setOrdersVisible] = useState(false);

  // Fetch user orders when profile is available or page changes
  useEffect(() => {
    if (id) {
      dispatch(fetchUserOrders({ userId: id, page: currentPage, pageSize }));
    }
  }, [dispatch, id, currentPage, pageSize]);

  // Fetch product details (names) to display in orders
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productIds = [...new Set(orders.flatMap((order) => order.items.map((item) => item.productId)))];
        const productResponses = await Promise.all(
          productIds.map((productId) =>
            fetch(`http://localhost:5000/products/${productId}`)
          )
        );
        const productData = await Promise.all(productResponses.map((res) => res.json()));
        setProducts(productData);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    if (orders.length > 0) {
      fetchProducts();
    }
  }, [orders]);

  // Populate form with profile data
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

  // Helper to get product name by ID
  const getProductName = (productId) => {
    const product = products.find((product) => product.id === productId);
    return product ? product.title : 'Unknown Product';
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    dispatch(setPage(page));
    dispatch(fetchUserOrders({ userId: id, page, pageSize }));
  };

  console.log('Total Orders:', totalOrders);
  console.log('Current Page:', currentPage);
  console.log('Page Size:', pageSize);

  return (
    <div>
      <h2>Your Profile</h2>

      {/* Profile Section Toggle */}
      <Collapse activeKey={profileVisible ? ['profile'] : []} onChange={(key) => setProfileVisible(key.includes('profile'))}>
        <Panel header="Profile Information" key="profile">
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please enter your first name!' }]} >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please enter your last name!' }]} >
              <Input />
            </Form.Item>
            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>

      <Divider />

      <Title level={3}>Your Orders</Title>

      {/* Orders Section Toggle */}
      <Collapse activeKey={ordersVisible ? ['orders'] : []} onChange={(key) => setOrdersVisible(key.includes('orders'))}>
        <Panel header="Order History" key="orders">
          {ordersStatus === 'loading' ? (
            <Spin tip="Loading Orders..." />
          ) : ordersStatus === 'failed' ? (
            <Text type="danger">{ordersError}</Text>
          ) : (
            <div>
              <List
                itemLayout="vertical"
                dataSource={orders}
                renderItem={(order) => (
                  <List.Item key={order.id}>
                    <Card style={{ marginBottom: 16 }} title={`Order #${order.id}`} extra={<Text>{new Date(order.date).toLocaleDateString()}</Text>}>
                      <Descriptions bordered>
                        <Descriptions.Item label="Order ID">{order.id}</Descriptions.Item>
                        <Descriptions.Item label="Order Date">{new Date(order.date).toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Total Price">{formatCurrency(order.total)}</Descriptions.Item>
                        <Descriptions.Item label="Items">
                          {order.items.map((item, index) => (
                            <div key={index}>
                              Product: {getProductName(item.productId)} - Quantity: {item.quantity}
                            </div>
                          ))}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </List.Item>
                )}
              />

              {/* Pagination for orders */}
              {typeof totalOrders === 'number' && !isNaN(totalOrders) && totalOrders > 0 ? (
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalOrders}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  style={{ textAlign: 'center', marginTop: '16px' }}
                  showTotal={(total) => `Total ${total} orders`}
                />
              ) : (
                <Text>No orders found.</Text>
              )}
            </div>
          )}
        </Panel>
      </Collapse>
    </div>
  );
};

export default UserProfile;
