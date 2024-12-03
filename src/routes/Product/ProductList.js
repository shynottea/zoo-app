// src/routes/Product/ProductList.js

import React, { useEffect, useMemo, useState } from 'react';
import ProductItem from './ProductItem';
import { Row, Col, Spin, Alert, Layout, Checkbox, Slider, Divider, Button, Radio, Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productsSlice';

const ProductList = ({ searchQuery }) => {
    const dispatch = useDispatch();
    const { items: products, status, error, limit } = useSelector((state) => state.products);

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
            filtered = filtered.sort((a, b) => b.rating - a.rating);
        }

        return filtered;
    }, [products, searchQuery, selectedCategories, priceRange, sortOption]);

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
                aria-label="category-filter" // Добавляем aria-label
                data-testid="category-filter" // Добавляем data-testid
            />
            <Divider />

            <h3>Price Range</h3>
            <Slider
                range
                min={0}
                max={Math.ceil(Math.max(...products.map((p) => p.price)))}
                step={1}
                value={priceRange}
                onChange={(value) => setPriceRange(value)}
                tipFormatter={(value) => `$${value}`}
                aria-label="price-slider" // Добавляем aria-label
                data-testid="price-slider" // Добавляем data-testid
            />
            <Divider />

            <h3>Sort By</h3>
            <Radio.Group
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{ color: 'white' }}
                aria-label="sort-options" // Добавляем aria-label
                data-testid="sort-options" // Добавляем data-testid
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

    if (status === 'loading') {
        return <Spin tip="Loading..." />;
    }

    if (status === 'failed') {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <Layout style={{ padding: '20px' }}>
            <Layout.Sider width={250} style={{ background: '#001529', color: 'white', padding: '20px' }}>
                {renderFilters()}
            </Layout.Sider>
            <Layout.Content>
                <Row gutter={[16, 16]}>
                    {paginatedProducts.map((product) => (
                        <Col key={product.id} xs={24} sm={12} md={8} lg={8} xl={6}>
                            <ProductItem product={product} />
                        </Col>
                    ))}
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
