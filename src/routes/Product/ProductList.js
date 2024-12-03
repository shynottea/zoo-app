// src/routes/Product/ProductList.js

import React, { useEffect, useMemo, useState } from 'react';
import ProductItem from './ProductItem';
import { Row, Col, Spin, Alert, Layout, Checkbox, Slider, Divider, Button, Radio, Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productsSlice';
import { fetchAllReviews } from '../../redux/slices/reviewSlice';

const ProductList = ({ searchQuery }) => {
  const dispatch = useDispatch();
  const { items: products, status, error, limit } = useSelector((state) => state.products);
  const { reviewsByProductId, status: reviewsStatus, error: reviewsError } = useSelector((state) => state.reviews);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 99999]);
  const [sortOption, setSortOption] = useState('priceLowToHigh');
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const allCategories = products.map((product) => product.category);
    return [...new Set(allCategories)];
  }, [products]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (reviewsStatus === 'idle') {
      dispatch(fetchAllReviews());
    }
  }, [dispatch, reviewsStatus]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortOption === 'priceLowToHigh') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceHighToLow') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'ratingHighToLow') {
      filtered = filtered.sort((a, b) => {
        const aReviews = reviewsByProductId[a.id] || [];
        const bReviews = reviewsByProductId[b.id] || [];
        const aAvg = aReviews.length > 0 ? (aReviews.reduce((sum, r) => sum + r.rating, 0) / aReviews.length) : 0;
        const bAvg = bReviews.length > 0 ? (bReviews.reduce((sum, r) => sum + r.rating, 0) / bReviews.length) : 0;
        return bAvg - aAvg;
      });
    }

    return filtered;
  }, [products, searchQuery, selectedCategories, priceRange, sortOption, reviewsByProductId]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, page, limit]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderFilters = () => (
    <div style={{ padding: '20px' }}>
      <h3>Categories</h3>
      <Checkbox.Group
        options={categories.map((category) => ({
          label: <span style={{ color: 'white' }}>{category}</span>,
          value: category,
        }))}
        value={selectedCategories}
        onChange={(checkedValues) => setSelectedCategories(checkedValues)}
      />
      <Divider />

      <h3>Price Range</h3>
      <Slider
        range
        min={0}
        max={Math.ceil(Math.max(...products.map((p) => p.price))) || 1000}
        step={1}
        value={priceRange}
        onChange={(value) => setPriceRange(value)}
        tipFormatter={(value) => `$${value}`}
      />
      <Divider />

      <h3>Sort By</h3>
      <Radio.Group
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        style={{ color: 'white' }}
      >
        <Radio value="priceLowToHigh" style={{ color: 'white' }}>
          Price: Low to High
        </Radio>
        <Radio value="priceHighToLow" style={{ color: 'white' }}>
          Price: High to Low
        </Radio>
        <Radio value="ratingHighToLow" style={{ color: 'white' }}>
          Rating: High to Low
        </Radio>
      </Radio.Group>
      <Divider />

      <Button
        onClick={() => {
          setSelectedCategories([]);
          setPriceRange([0, 99999]);
          setSortOption('priceLowToHigh');
        }}
      >
        Reset Filters
      </Button>
    </div>
  );

  if (status === 'loading' || reviewsStatus === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin tip="Loading..." size="large" />
      </div>
    );
  }

  if (status === 'failed') {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (reviewsStatus === 'failed') {
    return <Alert message="Error" description={reviewsError} type="error" showIcon />;
  }

  return (
    <Layout style={{ padding: '20px' }}>
      <Layout.Sider width={250} style={{ background: '#001529', color: 'white', padding: '20px' }}>
        {renderFilters()}
      </Layout.Sider>
      <Layout.Content>
        <Row gutter={[16, 16]}>
          {paginatedProducts.map((product) => {
            const productReviews = reviewsByProductId[product.id] || [];
            const averageRating = productReviews.length > 0
              ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(2)
              : null;

            return (
              <Col key={product.id} xs={24} sm={12} md={8} lg={8} xl={6}>
                <ProductItem product={{ ...product, rating: averageRating }} />
              </Col>
            );
          })}
        </Row>

        <Pagination
          current={page}
          total={filteredProducts.length}
          pageSize={limit}
          onChange={handlePageChange}
          showSizeChanger={false}
          style={{ marginTop: '20px', textAlign: 'center' }}
        />
      </Layout.Content>
    </Layout>
  );
};

export default ProductList;
