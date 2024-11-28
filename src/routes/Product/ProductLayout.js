import React from 'react';
import { Outlet } from 'react-router-dom';

const ProductLayout = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Product Section</h1>
            {}
            <Outlet />
        </div>
    );
};

export default ProductLayout;