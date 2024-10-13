import React, { useMemo } from 'react';

function Cart({ cart }) {
  const cartTotal = useMemo(() => cart.length, [cart]);

  return (
    <div style={{ width: '30%', padding: '20px', borderLeft: '1px solid #ccc' }}>
      <h2>Your Cart</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
      <p>Total Items: {cartTotal}</p>
    </div>
  );
}

export default Cart;
