import React, { useState, useContext } from 'react';
import { CartContext } from '../CartContext'; // Import CartContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function ProductItem({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext); // Use addToCart from context
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const handleQuantityChange = (e) => {
    const value = Math.max(1, Number(e.target.value)); // Ensure quantity is at least 1
    setQuantity(value);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity }); // Add product to cart using context function
  };
  const handleMoreClick = () => {
    navigate(`/products/${product.id}`); // Navigate to the product details page
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
      <img
        src={product.image}
        alt={product.title}
        style={{ width: '100%', height: 'auto' }}
      />
      <h2>{product.title}</h2>
      <input
        type="number"
        value={quantity}
        min="1"
        onChange={handleQuantityChange}
        style={{ width: '60px', marginRight: '10px' }}
      />
      <button onClick={handleAddToCart} style={{ marginTop: '10px' }}>
        Add to Cart
      </button>
      <button onClick={handleMoreClick} style={{ marginLeft: '10px' }}>
        More
      </button>
    </div>
  );
}

export default ProductItem;
