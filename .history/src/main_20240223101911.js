import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';


import "firebase/auth";
import { createApp } from "vue";
import App from "./App.vue";
import VueTelInput from 'vue-tel-input';
import '../node_modules/vue-tel-input/dist/vue-tel-input.css';

import router from "./router.js"; // Import the router.js file
import { createStore } from "vuex";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)


const store = createStore({
  state: {
    language: "english", // default value
    isLoggedIn: false,
    // other state properties...
  },
  mutations: {
    setLanguage(state, newLanguage) {
      state.language = newLanguage;
    },
    setIsLoggedIn(state, newLogIn) {
      state.isLoggedIn = newLogIn;
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

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(VueTelInput);
app.use(Toast);
app.use(store);
app.use(router); // Use the router plugin
app.mount("#app"); // Mount the app to the DOM

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const batch = db.batch();

const auth = getAuth(app);
export { firebaseApp, db, auth, batch};
