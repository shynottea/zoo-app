import React, { useState } from 'react';

function ProductItem({ product, addToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
      <img
        src={product.image}
        alt={product.title}
        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
      />
      <h2>{product.title}</h2>
      <input
        type="number"
        value={quantity}
        min="1"
        onChange={handleQuantityChange}
      />
      <button onClick={handleAddToCart} style={{ marginTop: '10px' }}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductItem;
