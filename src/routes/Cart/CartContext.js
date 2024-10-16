import React, { createContext, useState, useMemo } from 'react';

// Create the CartContext
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Function to add product to cart
  const addToCart = (productToAdd) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(item => item.id === productToAdd.id);
      
      // Create a new cart array based on whether the product exists
      const newCart = existingProductIndex !== -1 
        ? prevCart.map((item, index) => 
            index === existingProductIndex 
              ? { ...item, quantity: item.quantity + productToAdd.quantity } 
              : item
          )
        : [...prevCart, { ...productToAdd, quantity: productToAdd.quantity }]; // Ensure quantity starts from the added amount
      
      return newCart; // Return the new cart state
    });
  };

  // Function to remove product from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Memoize the context value to avoid unnecessary re-renders
  const value = useMemo(() => ({ cart, addToCart, removeFromCart }), [cart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
