// Import the necessary modules from Vue Router
import { createRouter, createWebHistory } from 'vue-router';

// Import all views
import UserLogin from './views/UserLogin.vue';
import ContentCreation from './views/ContentCreation.vue';
import PurchaseCredits from './views/PurchaseCredits.vue';
import Contents from './views/ContentsHistory.vue';
import ContentPage from './views/ContentPage.vue';

// Define routes
const routes = [
  {
    path: '/',
    name: 'user-login',
    component: UserLogin
  },
  
  {
    path: '/content-page/:documentId',
    name: 'content-page',
    component: ContentPage,
    meta: { requiresAuth: true } // Add meta field to indicate authentication requirement
  },
  {
    path: '/content-creation',
    name: 'content-creation',
    component: ContentCreation,
    meta: { requiresAuth: true } // Add meta field to indicate authentication requirement
  },
  {
    path: '/purchase-credits',
    name: 'purchase-credits',
    component: PurchaseCredits,
    meta: { requiresAuth: true } // Add meta field to indicate authentication requirement
  },
  {
    path: '/my-contents',
    name: 'My Contents',
    component: Contents,
    meta: { requiresAuth: true } // Add meta field to indicate authentication requirement
  },
  {
    path: '/:catchAll(.*)', // Catch-all route for handling unknown routes
    redirect: '/' // Redirect to the default page
  }
];

// Create a new router instance using Vue Router 4 syntax
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Add a navigation guard using beforeEach
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('uid');
  const isAuthenticated = token != null;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'user-login' }); // Redirect to login if authentication is required but not authenticated
  } else {
    next(); // Proceed to the next route
  }
});

// Export the router instance
export default router;
