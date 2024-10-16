
import React from 'react';
import { Spin } from 'antd';

const withLoading = (WrappedComponent) => {
  return ({ isLoading, ...props }) => {
    if (isLoading) {
      return <Spin tip="Loading..." />;
    }
    return <WrappedComponent {...props} />;
  };
};

export default withLoading;
