// Import the necessary modules from Vue Router
import { createRouter, createWebHistory } from "vue-router";

// Import all views
import UserLogin from "./views/UserLogin.vue";
import ContentCreation from "./views/ContentCreation.vue";
import PurchaseCredits from "./views/PurchaseCredits.vue";
import Contents from "./views/ContentsHistory.vue";
import ContentPage from "./views/ContentPage.vue";
import HomePage from "./views/HomePage.vue";
import setUp from "./views/SetUp.vue";
import MyWP from "./views/MyWP.vue";
import FetchWP from "./views/FetchWP.vue";
import PhoneBot from "./views/PhoneBot.vue";
import WhatsappGroupCreator from "./views/WhatsappGroupCreator.vue";

// Define routes
const routes = [
  {
    path: "/login",
    name: "user-login",
    component: UserLogin,
  },
  {
    path: "/",
    name: "home-page",
    component: HomePage,
  },
  {
    path: "/phone-bot",
    name: "phone-bot",
    component: PhoneBot,
  },
  {
    path: "/set-up",
    name: "set-up",
    component: setUp,
  },
  {
    path: "/my-wp",
    name: "my-wp",
    component: MyWP,
  },
  {
    path: "/fetch-wp",
    name: "fetch-wp",
    component: FetchWP,
  },
  {
    path: "/content-page/:documentId",
    name: "content-page",
    component: ContentPage,
    meta: { requiresAuth: true }, // Add meta field to indicate authentication requirement
  },
  {
    path: "/content-creation",
    name: "content-creation",
    component: ContentCreation,
    meta: { requiresAuth: true }, // Add meta field to indicate authentication requirement
  },
  {
    path: "/purchase-credits",
    name: "purchase-credits",
    component: PurchaseCredits,
    meta: { requiresAuth: true }, // Add meta field to indicate authentication requirement
  },
  {
    path: "/whatsappgroup-creator",
    name: "whatsappgroup-creator",
    component: WhatsappGroupCreator,
    meta: { requiresAuth: true }, // Add meta field to indicate authentication requirement
  },
  {
    path: "/my-contents",
    name: "My Contents",
    component: Contents,
    meta: { requiresAuth: true }, // Add meta field to indicate authentication requirement
  },
  {
    path: "/:catchAll(.*)", // Catch-all route for handling unknown routes
    redirect: "/", // Redirect to the default page
  },
];

// Create a new router instance using Vue Router 4 syntax
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add a navigation guard using beforeEach
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("userToken");
  const isAuthenticated = token != null;

  const publicPages = ["user-login"]; // Add the names of the routes that don't require authentication

  if (!publicPages.includes(to.name) && !isAuthenticated) {
    next({ name: "user-login" }); // Redirect to login if authentication is required but not authenticated
  } else {
    next(); // Proceed to the next route
  }
});

// Export the router instance
export default router;
