
import React, { useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../Cart/CartContext';
import { AuthContext } from '../Authentication/AuthContext';
import { Card, Button, InputNumber } from 'antd';
import withLoading from './withLoading';

const { Meta } = Card;

function ProductItem({ product, isDetailView, isLoading }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const { isAuth } = useContext(AuthContext);  
  const navigate = useNavigate();

  const handleQuantityChange = (value) => value || 1;


  const handleAddToCart = useCallback((addToCart) => {
    const productWithQuantity = { ...product, quantity }; 
    addToCart(productWithQuantity); 
  }, [product, quantity]);
  

  const handleMoreClick = useCallback((navigate) => {
    navigate(`/products/${product.id}`); 
  }, [product.id]);
  

  if (isLoading) return null; 

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
              onChange={(value) => setQuantity(handleQuantityChange(value))} 
              style={{ marginRight: '10px' }}
            />
            <Button onClick={() => handleAddToCart(addToCart)}>Add to Cart</Button>
          </>
        )}
        {!isDetailView && (

          <Button onClick={() => handleMoreClick(navigate)} style={{ MarginTop: '10px' }}>
            More
          </Button>
        )}
      </div>
    </Card>
  );
}

export default withLoading(ProductItem); 
