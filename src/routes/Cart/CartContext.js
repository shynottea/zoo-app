import React, { createContext, useState } from 'react';

// Create the CartContext
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Function to add product to cart
  const addToCart = (productToAdd) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(item => item.id === productToAdd.id);
      
      if (existingProductIndex !== -1) {
        // If product exists, update the quantity
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += productToAdd.quantity;
        return updatedCart;
      } else {
        // If product doesn't exist, add it
        return [...prevCart, productToAdd];
      }
    });
  };

  // Function to remove product from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
