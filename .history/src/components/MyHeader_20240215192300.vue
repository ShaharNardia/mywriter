<template>
    <nav class="flex items-center justify-between pds-c-navigation pds-c-navigation_relative pds-c-navigation_trial">
      <div class="justify-space-between pds-state-u-clickable flex items-center">
        <!-- Icon and Logo Section -->
        <pds-icon-svg class="pds-u-mr-s3 pds-c-navigation__toggle">
          <!-- SVG Icon omitted for brevity -->
        </pds-icon-svg>
        <div class="pds-c-navigation__logo-container flex items-center">
          <img src="/assets/images/identity/logo.png" class="pds-c-navigation__logo pds-u-mr-s4 pds-u-state-clickable" tabindex="0">
        </div>
      </div>
      
      <!-- Navigation Items -->
      <div class="pds-c-navigation__items">
        <!-- Navigation items omitted for brevity -->
      </div>
      
      <!-- Right Section: Upgrade, Book a demo, and Tools -->
      <div class="flex">
        <!-- Upgrade Plan -->
        <pds-upgrade trackingid="Action / Upgrade" data-cy="upgrade-nav" class="pds-u-mr-s4 ng-star-inserted">
          <!-- Upgrade plan content omitted for brevity -->
        </pds-upgrade>
        <!-- Book a Demo -->
        <pds-button scheme="secondary" data-cy="book-a-demo-nav" class="pds-u-mr-s4 pds-c-navigation__item_mobile-hidden ng-star-inserted" loading="false" size="default" usage="button">
          <button class="pds-c-button pds-c-button_button pds-c-button_default pds-c-button_secondary" type="button" data-cy="button">
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
    name: 'MyHeader',
    // Component logic here (data, methods, computed properties, etc.)
  }
  </script>
  
  <style scoped>
  /* Your CSS styles here */
  </style>
  