import React, { useContext } from 'react';
import { CartContext } from './CartContext'; // Import CartContext

function Cart() {
  const { cart, removeFromCart } = useContext(CartContext); // Get cart and removeFromCart from context

  const cartTotal = cart.length;
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', width: '30%', marginLeft: '20px' }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.title} (x{item.quantity}) - ${(item.price * item.quantity).toFixed(2)}
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
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
