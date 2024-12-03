const fetchProductsData = async (serverUrl) => {
  try {
      const response = await fetch(serverUrl);
      const data = await response.json();
      if (!Array.isArray(data)) {
          console.warn('Unexpected response format:', data);
          return [];
      }
      return data;
  } catch (error) {
      console.error('Error fetching products:', error);
      return [];
  }
};

export { fetchProductsData }; 
  