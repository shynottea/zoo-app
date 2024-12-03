// src/routes/Product/ProductItem.js

import React from 'react';
import { Card, Button, InputNumber, Rate, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';

const { Meta } = Card;

function ProductItem({ product, isDetailView }) {
  const [quantity, setQuantity] = React.useState(1);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (value) => {
    setQuantity(value || 1);
  };

  const handleAddToCart = React.useCallback(() => {
    const productWithQuantity = { ...product, quantity };
    dispatch(addToCart(productWithQuantity));
  }, [dispatch, product, quantity]);

  const handleMoreClick = React.useCallback(() => {
    navigate(`/products/${product.id}`);
  }, [navigate, product.id]);

  return (
    <Card
      hoverable
      style={{ width: isDetailView ? 600 : 300, margin: '10px' }}
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
      <Meta
        title={product.title}
        description={
          <>
            <p>Price: ${product.price}</p>
            {product.rating !== null && product.rating !== undefined && (
              <div>
                <Rate disabled allowHalf value={parseFloat(product.rating)} />
                <span style={{ marginLeft: '8px' }}>{product.rating} / 5</span>
              </div>
            )}
          </>
        }
      />
      <div style={{ marginTop: '10px' }}>
        {product.stock === 0 ? (
          <Tag color="red">Out of Stock</Tag>
        ) : (
          isAuth && (
            <>
              <InputNumber
                min={1}
                value={quantity}
                onChange={handleQuantityChange}
                style={{ marginRight: '10px' }}
              />
              <Button onClick={handleAddToCart}>Add to Cart</Button>
            </>
          )
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
