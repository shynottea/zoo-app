// src/routes/Cart/Cart.js

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Typography, Divider, Alert, message } from 'antd';
import { removeFromCart, clearCart } from '../../redux/slices/cartSlice';
import { placeOrder } from '../../redux/slices/orderSlice';

const { Title, Text } = Typography;

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const userId = useSelector((state) => state.auth.id);
  const orderStatus = useSelector((state) => state.orders.status);
  const orderError = useSelector((state) => state.orders.error);

  const cartTotal = cart.length;
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      message.info('Your cart is empty.');
      return;
    }
    dispatch(placeOrder({ userId, items: cart })).then((action) => {
      if (action.type === 'orders/placeOrder/fulfilled') {
        dispatch(clearCart());
        message.success('Order placed successfully!');
      } else if (action.type === 'orders/placeOrder/rejected') {
        message.error(`Order Failed: ${action.payload}`);
      }
    });
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (text, item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={item.image}
            alt={item.title}
            style={{ width: '100px', height: '100px', marginRight: '10px', objectFit: 'cover' }}
          />
          <span>{item.title}</span>
        </div>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, item) => <span>{item.quantity}</span>,
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      render: (text, item) => (
        <span>${(item.price * item.quantity).toFixed(2)}</span>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, item) => (
        <Button
          type="primary"
          danger
          onClick={() => handleRemove(item.id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ccc',
        width: '80%',
        margin: '20px auto',
        borderRadius: '8px',
        backgroundColor: '#fff',
      }}
    >
      <Title level={2}>Your Cart</Title>
      {isAuth ? (
        <>
          <Divider />
          {cart.length === 0 ? (
            <Alert message="Your cart is empty." type="info" showIcon />
          ) : (
            <>
              <Table
                dataSource={cart}
                columns={columns}
                rowKey="id"
                pagination={false}
                style={{ marginBottom: '20px' }}
              />
              <Divider />
              <Text strong>Total Items: {cartTotal}</Text>
              <br />
              <Text strong>Total Price: ${totalPrice.toFixed(2)}</Text>
              <Divider />
              <Button
                type="primary"
                onClick={handleCheckout}
                loading={orderStatus === 'loading'}
              >
                Checkout
              </Button>
              {orderStatus === 'failed' && (
                <Alert
                  message="Order Failed"
                  description={orderError}
                  type="error"
                  showIcon
                  style={{ marginTop: '20px' }}
                />
              )}
              {orderStatus === 'succeeded' && (
                <Alert
                  message="Order Placed Successfully!"
                  type="success"
                  showIcon
                  style={{ marginTop: '20px' }}
                />
              )}
            </>
          )}
        </>
      ) : (
        <Alert message="Please log in to view your cart." type="warning" showIcon />
      )}
    </div>
  );
};

export default Cart;
