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
import { ref, computed, onMounted } from 'vue';
import MyHeader from './components/MyHeader.vue';
import { useStore } from 'vuex';

// Reactive state
const language = ref(localStorage.getItem('language') || 'english');

// Computed property to check login status
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('userToken');
});

// Change language function
function changeLanguage(newLanguage) {
  language.value = newLanguage;
  localStorage.setItem('language', newLanguage);
  // Assuming you have a Vuex store and a mutation setLanguage
   const store = useStore();
   store.commit('setLanguage', language.value);
}

// Vue 3 Lifecycle Hook
onMounted(() => {
  // Example of setting language or performing actions on mount
  const lang = localStorage.getItem('language') || 'english';
  changeLanguage(lang);
});
</script>

<style scoped>
/* Add your styles here */
</style>
