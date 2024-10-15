import React, { useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext';
import { Card, Button, InputNumber } from 'antd';

const { Meta } = Card;

function ProductItem({ product, isDetailView }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
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
        <InputNumber
          min={1}
          value={quantity}
          onChange={handleQuantityChange}
          style={{ marginRight: '10px' }}
        />
        <Button type="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
        {!isDetailView && (
          <Button onClick={handleMoreClick} style={{ marginLeft: '10px' }}>
            More
          </Button>
        )}
      </div>
    </Card>
  );
}

export default ProductItem;
