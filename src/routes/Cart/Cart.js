import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Typography, Divider } from 'antd';
import { removeFromCart } from '../../redux/slices/cartSlice';

const { Title, Text } = Typography;

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const isAuth = useSelector((state) => state.auth.isAuth);

  const cartTotal = cart.length;
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      render: (text, item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={item.image}
            alt={item.title}
            style={{ width: '100px', height: '100px', marginRight: '10px' }}
          />
          <span>{item.title}</span>
        </div>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (text, item) => <span>{item.quantity}</span>,
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      render: (text, item) => (
        <span>${(item.price * item.quantity).toFixed(2)}</span>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, item) => (
        <Button
          type="primary"
          danger
          onClick={() => dispatch(removeFromCart(item.id))}
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
      }}
    >
      <Title level={2}>Your Cart</Title>
      {isAuth ? (
        <>
          <Divider />
          {cart.length === 0 ? (
            <Text>No items in the cart</Text>
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
            </>
          )}
        </>
      ) : (
        <Text>Please log in to view your cart.</Text>
      )}
    </div>
  );
};

export default Cart;
