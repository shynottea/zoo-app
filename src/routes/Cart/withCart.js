// withCart.js
import React, { useContext } from 'react';
import { CartContext } from './CartContext';

// A higher-order component that injects cart-related props into the wrapped component
export const withCart = (Component) => (props) => {
    const { cart, addToCart, removeFromCart } = useContext(CartContext);

    return (
        <Component
            {...props}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
        />
    );
};
