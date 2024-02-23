import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'; // Import the router.js file

const firebaseConfig = {
    apiKey: "AIzaSyCPu4kGkhCryutV_o9Z2X_fUz6hVrfYd9E",
    authDomain: "mywriter-48a45.firebaseapp.com",
    projectId: "mywriter-48a45",
    storageBucket: "mywriter-48a45.appspot.com",
    messagingSenderId: "481464917312",
    appId: "1:481464917312:web:7e51ff2c40d0697671aea5",
    measurementId: "G-TL7RTHBMZ7"
};

initializeApp(firebaseConfig);

const app = createApp(App);
app.use(router); // Use the router plugin
app.mount('#app'); // Mount the app to the DOM


