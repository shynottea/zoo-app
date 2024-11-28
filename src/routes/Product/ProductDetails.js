import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Alert, Spin } from 'antd';
import ProductItem from './ProductItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../redux/slices/productsSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails: product, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (status === 'loading') {
    return <Spin tip="Loading..." />;
  }

  if (status === 'failed') {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '20px' }}>
      {product ? (
        <>
          <ProductItem product={product} isDetailView={true} />
          {product.description && (
            <Card style={{ marginTop: '20px' }}>
              <h3>Product Details</h3>
              <p>{product.description}</p>
            </Card>
          )}
        </>
      ) : (
        <Alert message="Product details are not available." type="warning" />
      )}
    </div>
  );
};

export default ProductDetails;
