// ProductList.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ProductItem from './ProductItem';
import { Row, Col } from 'antd';
import withLoading from './withLoading'; // Import the HOC
import { fetchProductsData } from './fetch';


const ProductList = ({ searchQuery }) => {  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const server = 'http://localhost:5000/products';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);  
      const data = await fetchProductsData(server);  
      setProducts(data);  
      setLoading(false);  
    };

    fetchData();
  }, []); 

  const pureAddToCart = (cart, productToAdd) => {
    const existingProductIndex = cart.findIndex(item => item.id === productToAdd.id);
  
    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += productToAdd.quantity;
      return updatedCart;
    } else {
      return [...cart, productToAdd];
    }
  };

  const addToCart = useCallback((productToAdd) => {
    setCart((prevCart) => pureAddToCart(prevCart, productToAdd));
  }, []);
    
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const memoizedProductList = useMemo(() => {
    return filteredProducts.map((product) => (
      <Col key={product.id} xs={24} sm={12} md={8} lg={8} xl={6}>
        <ProductItem product={product} addToCart={addToCart} />
      </Col>
    ));
  }, [filteredProducts, addToCart]);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {memoizedProductList}
      </Row>
    </div>
  );
};

export default withLoading(ProductList); 
