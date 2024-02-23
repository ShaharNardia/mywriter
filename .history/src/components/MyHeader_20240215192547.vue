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
    </div>
  </div>
</template>

<script>
export default {
  name: "MyHeader",
  // Component logic here (data, methods, computed properties, etc.)
};
</script>

<style scoped>
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
