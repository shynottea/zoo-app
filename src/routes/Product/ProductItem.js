import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, InputNumber, Rate } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';

const { Meta } = Card;

function ProductItem({ product, isDetailView }) {
  const [quantity, setQuantity] = useState(1);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (value) => {
    setQuantity(value || 1);
  };

  const handleAddToCart = useCallback(() => {
    const productWithQuantity = { ...product, quantity };
    dispatch(addToCart(productWithQuantity));
  }, [dispatch, product, quantity]);

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
            objectFit: 'cover',
          }}
        />
      }
    >
      <Meta title={product.title} description={
        <>
          <p>Price: ${product.price}</p>
          <Rate disabled defaultValue={product.rating} allowHalf />
        </>
        } />
      <div style={{ marginTop: '10px' }}>
        {isAuth && (
          <>
            <InputNumber
              min={1}
              value={quantity}
              onChange={handleQuantityChange}
              style={{ marginRight: '10px' }}
            />
            <Button onClick={handleAddToCart}>Add to Cart</Button>
          </>
        )}
        {!isDetailView && (
          <Button onClick={handleMoreClick} style={{ marginTop: '10px' }}>
            More
          </Button>
        )}
      </div>
    </Card>
  );
}

export default ProductItem;
