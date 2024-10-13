import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import ShoppingPage from './ShoppingPage';
import Cart from './Cart/Cart';
import ProductDetails from './Product/ProductDetails'; // Import ProductDetails

function App() {
  const [cart, setCart] = React.useState([]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + product.quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity: product.quantity }];
    });
    console.log('Added to cart:', product);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ShoppingPage addToCart={handleAddToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
        <Route path="/products/:id" element={<ProductDetails addToCart={handleAddToCart} />} /> {/* Add ProductDetails route */}
      </Routes>
    </Router>
  );
}

export default App;
