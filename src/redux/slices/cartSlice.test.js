// src/tests/cartSlice.test.js
import cartReducer, { addToCart, removeFromCart, clearCart } from './cartSlice';

describe('cartSlice', () => {
    const initialState = { items: [] };

    it('should handle adding a product to the cart', () => {
        const product = { id: 1, title: 'Product 1', price: 10, quantity: 1, image: 'image1.jpg' };

        const nextState = cartReducer(initialState, addToCart(product));

        expect(nextState.items).toHaveLength(1);
        expect(nextState.items[0]).toEqual({ ...product, quantity: 1 });
    });

    it('should increase the quantity of an existing product', () => {
        const product = { id: 1, title: 'Product 1', price: 10, quantity: 1, image: 'image1.jpg' };
        const initialCart = { items: [product] };

        const updatedProduct = { ...product, quantity: 2 };
        const nextState = cartReducer(initialCart, addToCart(updatedProduct));

        expect(nextState.items).toHaveLength(1);
        expect(nextState.items[0].quantity).toBe(2);
    });

    it('should handle removing a product from the cart', () => {
        const product = { id: 1, title: 'Product 1', price: 10, quantity: 1, image: 'image1.jpg' };
        const initialCart = { items: [product] };

        const nextState = cartReducer(initialCart, removeFromCart(1));

        expect(nextState.items).toHaveLength(0);
    });

    it('should handle clearing the cart', () => {
        const initialCart = { items: [{ id: 1, title: 'Product 1', price: 10, quantity: 1, image: 'image1.jpg' }] };

        const nextState = cartReducer(initialCart, clearCart());

        expect(nextState.items).toHaveLength(0);
    });
});
