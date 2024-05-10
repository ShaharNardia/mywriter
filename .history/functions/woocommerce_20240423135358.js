const axios = require("axios");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp();

// Define a function
function init() {

  const WP_BASE_URL = "https://yourwordpressdomain.com/wp-json/wp/v2"; // Replace with your WordPress site URL

  // Axios instance for WordPress API requests
  const WooCommerceAxios = axios.create({
    baseURL: WP_BASE_URL,
    headers: { "Content-Type": "application/json" },
    auth: { username: "your_username", password: "your_password" },
  });

  // Create a new product
exports.createProduct = functions.https.onCall(async (data, context) => {
  try {
      const response = await WooCommerceAxios.post('/products', data);
      return { id: response.data.id, status: 'Product Created' };
  } catch (error) {
      console.error('Error creating product:', error.message);
      throw new functions.https.HttpsError('unknown', 'Failed to create product', error);
  }
});

// Get products
exports.getProducts = functions.https.onCall(async (data, context) => {
  try {
      const response = await WooCommerceAxios.get('/products', { params: data });
      return response.data;
  } catch (error) {
      console.error('Error fetching products:', error.message);
      throw new functions.https.HttpsError('unknown', 'Failed to get products', error);
  }
});

// Update a product
exports.updateProduct = functions.https.onCall(async (data, context) => {
  const productId = data.id;
  delete data.id; // Remove ID from data payload as it's used in the URL
  try {
      const response = await WooCommerceAxios.post(`/products/${productId}`, data);
      return { status: 'Product Updated', productId: productId };
  } catch (error) {
      console.error('Error updating product:', error.message);
      throw new functions.https.HttpsError('unknown', 'Failed to update product', error);
  }
});

// Delete a product
exports.deleteProduct = functions.https.onCall(async (data, context) => {
  try {
      await WooCommerceAxios.delete(`/products/${data.id}`);
      return { status: 'Product Deleted', productId: data.id };
  } catch (error) {
      console.error('Error deleting product:', error.message);
      throw new functions.https.HttpsError('unknown', 'Failed to delete product', error);
  }
});


}

// Export the function
module.exports = {
  init
};
