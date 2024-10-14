import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../CartContext'; // Import CartContext for cart actions
import ProductItem from './ProductItem'; // Import ProductItem for reuse

const ProductDetails = () => {
  const { id } = useParams(); // Extract the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext); // Get addToCart from context

  
  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await fetch('http://localhost:5000/products'); // Fetch all products
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data
        console.log("Product ID to find:", id); // Log the product ID

        // Ensure id is converted to a number for comparison
        const foundProduct = data.find(product => product.id === Number(id)); 
        console.log("Found product:", foundProduct); // Log the found product
        
        if (!foundProduct) {
          throw new Error('Product not found');
        }

        setProduct(foundProduct); // Set the found product in state
      } catch (error) {
        setError(error.message); // Set error message in state
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProductById(); // Call the fetch function
  }, [id]); // Dependency array to re-run effect when ID changes
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      {product ? (
        // Reuse ProductItem to display the product
        <ProductItem
          product={product}
          addToCart={addToCart} // Pass addToCart function from context
        />
      ) : (
        <p>Product details are not available.</p>
      )}
    </div>
  );
};

export default ProductDetails;
