<template>
  <nav
    class="flex items-center justify-between pds-c-navigation pds-c-navigation_relative pds-c-navigation_trial"
  >
    <div class="justify-space-between pds-state-u-clickable flex items-center">
      <!-- Icon and Logo Section -->
      <pds-icon-svg class="pds-u-mr-s3 pds-c-navigation__toggle">
        <!-- SVG Icon omitted for brevity -->
      </pds-icon-svg>
      <div class="pds-c-navigation__logo-container flex items-center">
        asdasd
        <img
          src="/assets/images/identity/logo.png"
          class="pds-c-navigation__logo pds-u-mr-s4 pds-u-state-clickable"
          tabindex="0"
        />
      </div>
    </div>

    <!-- Navigation Items -->
    <div class="pds-c-navigation__items">
      <!-- Navigation items omitted for brevity -->
    </div>

    <!-- Right Section: Upgrade, Book a demo, and Tools -->
    <div class="flex">
      <!-- Upgrade Plan -->
      <pds-upgrade
        trackingid="Action / Upgrade"
        data-cy="upgrade-nav"
        class="pds-u-mr-s4 ng-star-inserted"
      >
        <!-- Upgrade plan content omitted for brevity -->
      </pds-upgrade>
      <!-- Book a Demo -->
      <pds-button
        scheme="secondary"
        data-cy="book-a-demo-nav"
        class="pds-u-mr-s4 pds-c-navigation__item_mobile-hidden ng-star-inserted"
        loading="false"
        size="default"
        usage="button"
      >
        <button
          class="pds-c-button pds-c-button_button pds-c-button_default pds-c-button_secondary"
          type="button"
          data-cy="button"
        >
          Book a demo
        </button>
      </pds-button>
      <!-- Navigation Tools -->
      <prowly-navigation-tools>
        <!-- Tools content omitted for brevity -->
      </prowly-navigation-tools>
    </div>
  </nav>
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
