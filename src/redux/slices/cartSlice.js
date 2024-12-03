// src/redux/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.items.find(item => item.id === product.id);

      if (existingProduct) {
        // Увеличиваем количество товара, если уже есть в корзине
        existingProduct.quantity += 1;
      } else {
        // Добавляем товар в корзину
        state.items.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
