import React, { createContext, useState, useMemo } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (productToAdd) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(item => item.id === productToAdd.id);
      
      const newCart = existingProductIndex !== -1 
        ? prevCart.map((item, index) => 
            index === existingProductIndex 
              ? { ...item, quantity: item.quantity + productToAdd.quantity } 
              : item
          )
        : [...prevCart, { ...productToAdd, quantity: productToAdd.quantity }]; 
      
      return newCart; 
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const value = useMemo(() => ({ cart, addToCart, removeFromCart }), [cart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
