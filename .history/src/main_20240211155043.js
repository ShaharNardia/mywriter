import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import "firebase/auth";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js"; // Import the router.js file
import { createStore } from "vuex";

const store = createStore({
  state: {
    language: "english", // default value
    // other state properties...
  },
  mutations: {
    setLanguage(state, newLanguage) {
      state.language = newLanguage;
    },
    // other mutations...
  },
  // mutations, actions, getters...
});

const firebaseConfig = {
  apiKey: "AIzaSyCPu4kGkhCryutV_o9Z2X_fUz6hVrfYd9E",
  authDomain: "mywriter-48a45.firebaseapp.com",
  projectId: "mywriter-48a45",
  storageBucket: "mywriter-48a45.appspot.com",
  messagingSenderId: "481464917312",
  appId: "1:481464917312:web:7e51ff2c40d0697671aea5",
  measurementId: "G-TL7RTHBMZ7",
};

const app = createApp(App);
app.use(store);
app.use(router); // Use the router plugin
app.mount("#app"); // Mount the app to the DOM

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { firebaseApp, db };
