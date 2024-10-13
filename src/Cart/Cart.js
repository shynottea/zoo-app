import React, { useMemo, useCallback } from 'react';

function Cart({ cart = [], removeFromCart }) {  // Default cart to an empty array
  // Memoize total count and price
  const cartTotal = useMemo(() => cart.length, [cart]);
  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const handleRemove = useCallback((productId) => {
    removeFromCart(productId); // onClick event handler for removing items
  }, [removeFromCart]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', width: '30%', marginLeft: '20px' }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.title} (x{item.quantity}) - ${item.price * item.quantity}
              <button onClick={() => handleRemove(item.id)}>Remove</button> {/* onClick event handler */}
            </li>
          ))}
        </ul>
      )}
      <p>Total Items: {cartTotal}</p>
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
    </div>
  );
}

export default Cart;
