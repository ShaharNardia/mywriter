const axios = require("axios");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp();

// Define a function
function wpFunction() {
  admin.initializeApp();

  const WP_BASE_URL = "https://yourwordpressdomain.com/wp-json/wp/v2"; // Replace with your WordPress site URL

  // Axios instance for WordPress API requests
  const wpAxios = axios.create({
    baseURL: WP_BASE_URL,
    headers: { "Content-Type": "application/json" },
    auth: { username: "your_username", password: "your_password" },
  });

  // Create a new post
  exports.createPost = functions.https.onCall(async (data, context) => {
    try {
      const response = await wpAxios.post("/posts", data);
      return { id: response.data.id, status: "Post Created" };
    } catch (error) {
      console.error("Error creating post:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to create post",
        error
      );
    }
  });

  // Get posts
  exports.getPosts = functions.https.onCall(async (data, context) => {
    try {
      const response = await wpAxios.get("/posts", { params: data });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to get posts",
        error
      );
    }
  });

  // Update a post
  exports.updatePost = functions.https.onCall(async (data, context) => {
    const postId = data.id;
    delete data.id; // Remove ID from data payload as it's used in the URL
    try {
      const response = await wpAxios.post(`/posts/${postId}`, data);
      return { status: "Post Updated", postId: postId };
    } catch (error) {
      console.error("Error updating post:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to update post",
        error
      );
    }
  });

  // Delete a post
  exports.deletePost = functions.https.onCall(async (data, context) => {
    try {
      await wpAxios.delete(`/posts/${data.id}`);
      return { status: "Post Deleted", postId: data.id };
    } catch (error) {
      console.error("Error deleting post:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to delete post",
        error
      );
    }
  });

  // CRUD operations for Pages, Categories, and Media can be implemented in a similar manner.
  // For example, here's how you might set up a function to manage categories:

  // Create a new category
  exports.createCategory = functions.https.onCall(async (data, context) => {
    try {
      const response = await wpAxios.post("/categories", data);
      return { id: response.data.id, status: "Category Created" };
    } catch (error) {
      console.error("Error creating category:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to create category",
        error
      );
    }
  });

  // Get categories
  exports.getCategories = functions.https.onCall(async (data, context) => {
    try {
      const response = await wpAxios.get("/categories", { params: data });
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to get categories",
        error
      );
    }
  });

  // Update a category
  exports.updateCategory = functions.https.onCall(async (data, context) => {
    const categoryId = data.id;
    delete data.id; // Remove ID from data payload as it's used in the URL
    try {
      const response = await wpAxios.post(`/categories/${categoryId}`, data);
      return { status: "Category Updated", categoryId: categoryId };
    } catch (error) {
      console.error("Error updating category:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to update category",
        error
      );
    }
  });

  // Delete a category
  exports.deleteCategory = functions.https.onCall(async (data, context) => {
    try {
      await wpAxios.delete(`/categories/${data.id}`);
      return { status: "Category Deleted", categoryId: data.id };
    } catch (error) {
      console.error("Error deleting category:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to delete category",
        error
      );
    }
  });

  // Create a new page
  exports.createPage = functions.https.onCall(async (data, context) => {
    try {
      const response = await wpAxios.post("/pages", data);
      return { id: response.data.id, status: "Page Created" };
    } catch (error) {
      console.error("Error creating page:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to create page",
        error
      );
    }
  });

  // Get pages
  exports.getPages = functions.https.onCall(async (data, context) => {
    try {
      const response = await wpAxios.get("/pages", { params: data });
      return response.data;
    } catch (error) {
      console.error("Error fetching pages:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to get pages",
        error
      );
    }
  });

  // Update a page
  exports.updatePage = functions.https.onCall(async (data, context) => {
    const pageId = data.id;
    delete data.id; // Remove ID from data payload as it's used in the URL
    try {
      const response = await wpAxios.post(`/pages/${pageId}`, data);
      return { status: "Page Updated", pageId: pageId };
    } catch (error) {
      console.error("Error updating page:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to update page",
        error
      );
    }
  });

  // Delete a page
  exports.deletePage = functions.https.onCall(async (data, context) => {
    try {
      await wpAxios.delete(`/pages/${data.id}`);
      return { status: "Page Deleted", pageId: data.id };
    } catch (error) {
      console.error("Error deleting page:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to delete page",
        error
      );
    }
  });

  // Additional functions for getting, updating, and deleting categories can be added similarly.
  // Upload media
  exports.uploadMedia = functions.https.onCall(async (data, context) => {
    try {
      const formData = new FormData();
      formData.append("file", data.file, data.name); // Assuming data.file is the file stream

      const response = await wpAxios.post("/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...formData.getHeaders(),
        },
      });
      return { id: response.data.id, status: "Media Uploaded" };
    } catch (error) {
      console.error("Error uploading media:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to upload media",
        error
      );
    }
  });

  // Get media items
  exports.getMedia = functions.https.onCall(async (data, context) => {
    try {
      const response = await wpAxios.get("/media", { params: data });
      return response.data;
    } catch (error) {
      console.error("Error fetching media:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to get media",
        error
      );
    }
  });

  // Update media details
  exports.updateMedia = functions.https.onCall(async (data, context) => {
    const mediaId = data.id;
    delete data.id; // Remove ID from data payload as it's used in the URL
    try {
      const response = await wpAxios.post(`/media/${mediaId}`, data);
      return { status: "Media Updated", mediaId: mediaId };
    } catch (error) {
      console.error("Error updating media:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to update media",
        error
      );
    }
  });

  // Delete media
  exports.deleteMedia = functions.https.onCall(async (data, context) => {
    try {
      await wpAxios.delete(`/media/${data.id}`);
      return { status: "Media Deleted", mediaId: data.id };
    } catch (error) {
      console.error("Error deleting media:", error.message);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to delete media",
        error
      );
    }
  });
}

// Export the function
module.exports = {
  wpFunction,
};
