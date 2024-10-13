import React from 'react';
import { DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  // Handler to navigate to the Cart page
  const goToCart = () => {
    navigate('/cart');
  };
  const goToShoppingList = () => {
    navigate('/');
  };
  return (
    <div>
      <button onClick={goToCart}>Go to Cart</button> {/* Redirects to Cart */}
      <button onClick={goToShoppingList}>Go to ShoppingList</button> {/* Redirects to Cart */}
    </div>
  );
}

export default Navbar;
