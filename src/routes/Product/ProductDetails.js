import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../CartContext';
import { Card, Alert } from 'antd';
import { fetchProductsData } from './fetch'; // Adjust the import path if needed
import ProductItem from './ProductItem';
import withLoading from './withLoading'; // Import the HOC

const ProductDetails = ({ isLoading }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const server='http://localhost:5000/products'
  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const data = await fetchProductsData(server); // Use the fetchProductsData function

        const foundProduct = data.find(product => product.id === parseInt(id, 10));
        if (!foundProduct) {
          throw new Error('Product not found');
        }

        setProduct(foundProduct);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProductById();
  }, [id]);

  const memoizedProduct = useMemo(() => product, [product]);

  if (error) return <Alert message={error} type="error" />;

  return (
    <div style={{ padding: '20px' }}>
      {memoizedProduct ? (
        <>
          <ProductItem product={memoizedProduct} addToCart={addToCart} isDetailView={true} />
          {/* Display product details if available */}
          {memoizedProduct.description && (
            <Card style={{ marginTop: '20px' }}>
              <h3>Product Details</h3>
              <p>{memoizedProduct.description}</p>
            </Card>
          )}
        </>
      ) : (
        <Alert message="Product details are not available." type="warning" />
      )}
    </div>
  );
};

export default withLoading(ProductDetails); // Wrap ProductDetails with the HOC
