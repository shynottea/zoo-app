  import React, { useState, useCallback, useContext } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { CartContext } from '../CartContext';

  function ProductItem({ product }) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleQuantityChange = (e) => {
      const value = Math.max(1, Number(e.target.value));
      setQuantity(value);
    };

    const handleAddToCart = useCallback(() => {
      addToCart({ ...product, quantity });
    }, [addToCart, product, quantity]);

    const handleMoreClick = useCallback(() => {
      navigate(`/products/${product.id}`);
    }, [navigate, product.id]);

    return (
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: '400px', height: 'auto' }}
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
