// Import the necessary modules from Vue Router
import { createRouter, createWebHistory } from 'vue-router';

// Import all views
import UserLogin from './views/UserLogin.vue';
import ContentCreation from './views/ContentCreation.vue';
import PurchaseCredits from './views/PurchaseCredits.vue';
import Contents from './views/Contents.vue';

// Define routes
const routes = [
  {
    path: '/',
    name: 'user-login',
    component: UserLogin
  },
  {
    path: '/content-creation',
    name: 'content-creation',
    component: ContentCreation
  },
  {
    path: '/purchase-credits',
    name: 'purchase-credits',
    component: PurchaseCredits
  },
  {
    path: '/purchase-history',
    name: 'purchase-history',
    component: Contents
  }
];

// Create a new router instance using Vue Router 4 syntax
const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

// Export the router instance
export default router;
