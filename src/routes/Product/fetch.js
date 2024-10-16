// api.js
const fetchProductsData = async (serverUrl) => {
    try {
      const response = await fetch(serverUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };
  
  export { fetchProductsData }; // Named export
  