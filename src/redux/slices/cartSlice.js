import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], 
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingProduct = state.items.find((item) => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        state.items.push({ ...product });
      }
    },
    removeFromCart(state, action) {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
