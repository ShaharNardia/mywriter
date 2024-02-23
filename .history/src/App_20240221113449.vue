<template>
  <div id="app">
    isLoggedIn - {{ isLoggedIn }}
    <my-header :is-logged-in="isLoggedIn"></my-header>
    <div class="main-content" :class="language !== 'english' ? 'rtl' : 'ltr'">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import MyHeader from "./components/MyHeader.vue";
import { useStore } from "vuex";

// Reactive state
const language = ref(localStorage.getItem("language") || "english");
const isLoggedIn = ref(!!localStorage.getItem("userToken"));

// Update isLoggedIn based on localStorage changes
function updateLoginStatus() {
  isLoggedIn.value = !!localStorage.getItem("userToken");
}

// Listen to storage changes
function onStorageChange(event) {
  if (event.key === "userToken") {
    updateLoginStatus();
  }
}
// Change language function
function changeLanguage(newLanguage) {
  language.value = newLanguage;
  localStorage.setItem("language", newLanguage);
  // Assuming you have a Vuex store and a mutation setLanguage
  const store = useStore();
  store.commit("setLanguage", language.value);
}

// Vue 3 Lifecycle Hook
onMounted(() => {
  window.addEventListener("storage", onStorageChange);
  const lang = localStorage.getItem("language") || "english";
  changeLanguage(lang);
});
onUnmounted(() => {
  window.removeEventListener("storage", onStorageChange);
});
</script>

<style scoped>
/* Add your styles here */
</style>

<style>
.flexed {
  display: flex;
  /* justify-content: space-between; */
  margin: 6% 0;
}
.marg-l-2 {
  margin-left: 3vh;
}
.rtl {
  direction: rtl;
}
.ltr {
  direction: ltr;
}
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  /* background-color: #f5f8fa; */
  width: 98%;
  margin: 0 auto;
}

.menu-vertical,
.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-vertical {
  display: flex;
}

.menu li {
  margin-right: 10px;
}

.menu li a {
  text-decoration: none;
  color: #333;
}

.router-view {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}
.disclaimer {
  font-size: 16px;
  color: #333;
  margin-left: 0.5vh;
  font-weight: lighter;
  /* margin-top:0.3vh; */
}
/* Add your custom Twitter-like styles here */

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  padding: 10px;
  /* width: 100%; */
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: #555;
}
.align-center {
  display: flex;
  justify-content: center;
  margin-top: 2vh;
}
.width22 {
  width: 22%;
}
.width62 {
  width: 62%;
}
.grid-page {
  display: flex;
  justify-content: center;
  align-items: center;
}

.squares-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.square {
  border: 0.1vh inset black;
  padding: 20px;
  border-radius: 9px;
}
.input {
  padding: 0.28vh 0.1vh;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: #555;
}
.input-100 {
  width: 100%;
}
.div-88 {
  width: 88%;
}
.aligned-center {
  display: flex;
  justify-content: center;
  margin-top: 6vh;
}
.vue-tel-input {
  width: 85%;
  /* margin-left: 2vh; */
}
.vti__input {
  padding-left: 0vh !important;
}
.width100 {
  width: 100%;
}
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.main-content {
  padding: 20px;
  border-radius: 10px;
  /* box-shadow: 1px 2px 40px rgba(0, 0, 0, 0.1);  */
  /* background-color: #f5f5f5; */
  min-height: 50vh;
  width: 100%;
}

.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-bottom: black 1px solid;
  padding: 0 5% 1% 5%;
}

.nav-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.logo {
  margin-right: auto;
  height: 6vh; /* Adjust as needed */
  width: auto;
  margin: 0 1vh;
}

.language-select {
  margin-left: auto;
  margin-top: 20px;
  height: 25px;
  border: none;
}
nav {
  margin-top: 20px;
}

.menu li {
  margin-right: 10px;
  border-bottom: none;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #fff;
  display: flex;
  align-items: baseline;
}

.menu li a {
  text-decoration: none;
  color: #333;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  display: block;
  padding: 10px;
}

.menu li a.active {
  background-color: #f5f5f5;
  border-top-right-radius: 9px;
  border-top-left-radius: 9px;
  /* box-shadow: 1px 2px 40px rgba(0, 0, 0, 0.1); */
}

.menu li select {
  padding: 5px;
  border: none;
  background-color: white;
  color: #007bff;
  border: none;
}

.menu li select option {
  border: none;
}
</style>
