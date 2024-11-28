import React, { useEffect, useMemo } from 'react';
import ProductItem from './ProductItem';
import { Row, Col, Spin, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productsSlice';

const ProductList = ({ searchQuery }) => {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  if (status === 'loading') {
    return <Spin tip="Loading..." />;
  }

  if (status === 'failed') {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {filteredProducts.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={8} xl={6}>
            <ProductItem product={product} isDetailView={false} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList;
