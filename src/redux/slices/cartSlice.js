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
      const existingProduct = state.items.find((item) => String(item.id) === String(product.id));

      if (existingProduct) {
        // Увеличиваем количество товара, если уже есть в корзине
        existingProduct.quantity += 1;
      } else {
        state.items.push({ ...product, id: String(product.id) }); // Ensure id is string
      }
    },
    removeFromCart(state, action) {
      const productId = String(action.payload); // Ensure id is string
      state.items = state.items.filter((item) => String(item.id) !== productId);
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
