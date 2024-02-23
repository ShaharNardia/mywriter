<template>
  <div class="top-header">
    <div>
      <router-link to="/">
        <img src="../assets/logo.png" alt="Logo" class="logo" />
      </router-link>
    </div>
    <header class="header" v-if="this.$route.path !== '/login'">
      <nav class="nav-container">
        <ul class="menu">
          <li v-for="(item, index) in menuItems" :key="index">
            <router-link :to="item.path" active-class="active">{{
              item.name
            }}</router-link>
          </li>
        </ul>
      </nav>
    </header>
    <div>
      <select
        v-model="selectedLanguage"
        @change="changeLanguage"
        class="language-select"
      >
        <option
          v-for="(option, index) in languageOptions"
          :key="index"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
      <div class="button-container">
        <button class="rounded-button" @click="showNotificationPopup">
          <span
            :class="{ 'jump-animation': isJumping }"
            style="color: white; margin-right: 15px"
            >15</span
          >
          <font-awesome-icon :icon="['fas', 'bell']" />
        </button>
        <button class="rounded-button" @click="showSettingsPopup">
          <font-awesome-icon :icon="['fas', 'gear']" />
        </button>
        <button class="rounded-button" @click="showUserPopup">
          {{ username.toUpperCase().slice(0, 2) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  name: "MyHeader",

  setup() {
    const state = inject("state");

    return { state };
  },
  data() {
    return {
      isJumping: false,
      selectedLanguage: "english",
      username: !localStorage.getItem("username")
        ? "user"
        : localStorage.getItem("username"),
      menuItems: [
        { name: "My Contents", path: "/my-contents" },
        { name: "Content Creation", path: "/content-creation" },
        { name: "Buy Credits", path: "/purchase-credits" },
      ],
      languageOptions: [
        { text: "עברית", value: "hebrew" },
        { text: "English", value: "english" },
      ],
      language: localStorage.getItem("language") || "english",
    };
  },
  mounted() {
    setInterval(() => {
      this.isJumping = true;
      setTimeout(() => {
        this.isJumping = false;
      }, 1000); // Reset the jumping state after 1 second
    }, 3000); // Trigger the jumping state every 3 seconds
  },
  methods: {
    changeLanguage() {
      this.language = this.selectedLanguage;
      this.$store.commit("setLanguage", this.language);
    },
    showUserPopup() {
      // Logic to show user popup
    },
    showSettingsPopup() {
      // Logic to show settings popup
    },
    showNotificationPopup() {
      // Logic to show notification popup
    },
  },
};
</script>

<style scoped>
/* Existing styles... */
.button-container {
  display: flex;
  gap: 10px;
}

.rounded-button {
  /* border-radius: 50%; */
  /* padding: 10px; */
  border: none;
  cursor: pointer;
}
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.pds-c-navigation {
  /* Your styles for pds-c-navigation class */
}

.pds-c-navigation_relative {
  /* Your styles for pds-c-navigation_relative class */
}

.pds-c-navigation_trial {
  /* Your styles for pds-c-navigation_trial class */
}

.justify-space-between {
  justify-content: space-between;
}

.pds-state-u-clickable {
  /* Your styles for pds-state-u-clickable class */
}

.pds-u-mr-s3 {
  margin-right: 0.75rem;
}

.pds-c-navigation__toggle {
  /* Your styles for pds-c-navigation__toggle class */
}

.pds-c-navigation__logo-container {
  /* Your styles for pds-c-navigation__logo-container class */
}

.pds-c-navigation__logo {
  /* Your styles for pds-c-navigation__logo class */
}

.pds-u-mr-s4 {
  margin-right: 1rem;
}

.pds-u-state-clickable {
  /* Your styles for pds-u-state-clickable class */
}

.pds-c-navigation__items {
  /* Your styles for pds-c-navigation__items class */
}

.pds-upgrade {
  /* Your styles for pds-upgrade class */
}

.ng-star-inserted {
  /* Your styles for ng-star-inserted class */
}

.pds-c-navigation__item_mobile-hidden {
  /* Your styles for pds-c-navigation__item_mobile-hidden class */
}

.pds-button {
  /* Your styles for pds-button class */
}

.pds-c-button {
  /* Your styles for pds-c-button class */
}

.pds-c-button_button {
  /* Your styles for pds-c-button_button class */
}

.pds-c-button_default {
  /* Your styles for pds-c-button_default class */
}

.pds-c-button_secondary {
  /* Your styles for pds-c-button_secondary class */
}

.prowly-navigation-tools {
  /* Your styles for prowly-navigation-tools class */
}
</style>
