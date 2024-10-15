// ProductItem.js
import React, { useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext';
import { AuthContext } from '../AuthContext';  
import { Card, Button, InputNumber } from 'antd';
import withLoading from './withLoading'; // Import the HOC

const { Meta } = Card;

function ProductItem({ product, isDetailView, isLoading }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const { isAuth } = useContext(AuthContext);  
  const navigate = useNavigate();

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const handleAddToCart = useCallback(() => {
    addToCart({ ...product, quantity });
  }, [addToCart, product, quantity]);

  const handleMoreClick = useCallback(() => {
    navigate(`/products/${product.id}`);
  }, [navigate, product.id]);

  if (isLoading) return null; // Optionally handle loading state

  return (
    <Card
      hoverable
      style={{ width: isDetailView ? 600 : 300 }}
      cover={
        <img 
          alt={product.title} 
          src={product.image} 
          style={{ 
            height: isDetailView ? 400 : 200, 
            objectFit: 'cover' 
          }} 
        />
      }
    >
      <Meta title={product.title} description={`Price: $${product.price}`} />
      <div style={{ marginTop: '10px' }}>
        {isAuth && (
          <>
            <InputNumber
              min={1}
              value={quantity}
              onChange={handleQuantityChange}
              style={{ marginRight: '10px' }}
            />
            <Button type="primary" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </>
        )}
        {!isDetailView && (
          <Button onClick={handleMoreClick} style={{ marginLeft: '10px' }}>
            More
          </Button>
        )}
      </div>
    </Card>
  );
}

export default withLoading(ProductItem); // Wrap ProductItem with HOC if necessary
