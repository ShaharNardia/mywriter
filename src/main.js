import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createStore } from "vuex";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import VueTelInput from 'vue-tel-input';
import '../node_modules/vue-tel-input/dist/vue-tel-input.css';

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

library.add(fas);

const firebaseConfig = {
  apiKey: "AIzaSyCPu4kGkhCryutV_o9Z2X_fUz6hVrfYd9E",
  authDomain: "mywriter-48a45.firebaseapp.com",
  projectId: "mywriter-48a45",
  storageBucket: "mywriter-48a45.appspot.com",
  messagingSenderId: "481464917312",
  appId: "1:481464917312:web:7e51ff2c40d0697671aea5",
  measurementId: "G-TL7RTHBMZ7",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const store = createStore({
  state: {
    language: "english",
    isLoggedIn: false,
  },
  mutations: {
    setLanguage(state, newLanguage) {
      state.language = newLanguage;
    },
    setIsLoggedIn(state, newLogIn) {
      state.isLoggedIn = newLogIn;
    },
  },
});

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(VueTelInput);
app.use(Toast);
app.use(store);
app.use(router);
app.mount("#app");

export { firebaseApp, db, auth };
