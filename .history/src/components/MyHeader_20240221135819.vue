<template>
  <div class="top-header">
    <div>
      <router-link to="/">
        <img src="../assets/logo.png" alt="Logo" class="logo" />
      </router-link>
    </div>
    <header class="header" v-if="isLoggedIn">
      <nav class="nav-container">
        <ul class="menu menu-vertical">
          <li v-for="(item, index) in menuItems" :key="index">
            <router-link :to="item.path" active-class="active">{{
              item.name
            }}</router-link>
          </li>
        </ul>
      </nav>
    </header>
    <div>
      <!-- <select
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
      </select> -->
      <div class="button-container" v-if="isLoggedIn">
        <div class="button-pop">
          <button class="rounded-button" @click="showNotificationPopup">
            <span
              v-if="newNotifications > 0"
              :class="{ 'jump-animation': isJumping }"
              style="color: white; margin-right: 15px"
              >{{ newNotifications }}</span
            >
            <font-awesome-icon :icon="['fas', 'bell']" />
          </button>
          <div class="notification-popup" v-if="showNotificationPopupVisible">
            <ul class="menu">
              <li
                v-for="(item, index) in notifications"
                :key="index"
                :class="item.seen ? '' : 'new-notification'"
              >
                <router-link @click="closePopup" :to="item.path">{{ item.name }}</router-link>
              </li>
            </ul>
          </div>
        </div>

        <div class="button-pop">
          <button class="rounded-button" @click="showSettingsPopup">
            <font-awesome-icon :icon="['fas', 'gear']" />
          </button>
          <div class="settings-popup" v-if="showSettingsPopupVisible">
            <ul class="menu">
              <li>
                <font-awesome-icon :icon="['fas', 'sync']" /><router-link @click="closePopup" to="/"
                  >Set auto generate content job</router-link
                >
              </li>
              <li>
                <font-awesome-icon :icon="['fas', 'edit']" /><router-link @click="closePopup" to="/set-up"
                  >Edit your prefrences</router-link
                >
              </li>
              <li>
                <font-awesome-icon :icon="['fas', 'link']" /><router-link to="/"
                  >Set webhook</router-link
                >
              </li>
              <li>
                <font-awesome-icon :icon="['fas', 'envelope']" /><router-link
                  to="/"
                  >Contact us</router-link
                >
              </li>
            </ul>
          </div>
        </div>

        <div class="button-pop">
          <button class="rounded-button" @click="showUserPopup">
            <!-- {{ username.toUpperCase().slice(0, 2) }} -->
            {{userName}}
          </button>
          <div class="user-popup" v-if="showUserPopupVisible">
            <div @click="logout" style="cursor: pointer">Log out</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { inject } from "vue";
// import { mapState } from "vuex";

export default {
  name: "MyHeader",

  setup() {},
  computed: {},
  props: {
    isLoggedIn: Boolean,
    username: String,
  },
  data() {
    return {
      user: localStorage.getItem("user"),
      authState: !!localStorage.getItem("userToken"),
      showUserPopupVisible: false,
      notifications: [
        { name: "Notification 1", seen: false, path: "/notification-1" },
        { name: "Notification 2", seen: true, path: "/notification-2" },
        { name: "Notification 3", seen: false, path: "/notification-3" },
      ],
      newNotifications: 0,
      showSettingsPopupVisible: false,
      showNotificationPopupVisible: false,
      isJumping: false,
      selectedLanguage: "english",
      // username: !localStorage.getItem("user")
      //   ? "user"
      //   : JSON.parse(localStorage.getItem("user"))?.firstName[0] +
      //     JSON.parse(localStorage.getItem("user"))?.lastName[0],
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
    this.authState = !!localStorage.getItem("userToken");
    window.addEventListener("storage", this.handleStorageChange);
    document.addEventListener("click", this.closePopups);
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.handleStorageChange);
    document.removeEventListener("click", this.closePopups);
  },
  methods: {
    handleStorageChange(event) {
      if (event.key === "userToken") {
        this.authState = !!localStorage.getItem("userToken");
        // Also update the user data property when userToken changes
        this.user = localStorage.getItem("user");
      }
      // Handle other storage changes if necessary
    },
    logout() {
      localStorage.clear();
      this.authState = false; // Update the reactive property
      this.$router.push("/login");
    },
    closePopups(event) {
      // Check if the click was outside a popup
      if (!event.target.closest(".button-pop")) {
        this.showUserPopupVisible = false;
        this.showSettingsPopupVisible = false;
        this.showNotificationPopupVisible = false;
      }
    },
    closePopup() {
      this.showUserPopupVisible = false;
      this.showSettingsPopupVisible = false;
      this.showNotificationPopupVisible = false;
    },
    changeLanguage() {
      this.language = this.selectedLanguage;
      this.$store.commit("setLanguage", this.language);
    },
    showUserPopup() {
      this.showSettingsPopupVisible = false;
      this.showNotificationPopupVisible = false;
      this.showUserPopupVisible = !this.showUserPopupVisible;
    },
    showSettingsPopup() {
      this.showUserPopupVisible = false;
      this.showNotificationPopupVisible = false;
      this.showSettingsPopupVisible = !this.showSettingsPopupVisible;
    },
    showNotificationPopup() {
      this.showUserPopupVisible = false;
      this.showSettingsPopupVisible = false;
      this.showNotificationPopupVisible = !this.showNotificationPopupVisible;
    },
  },
};
</script>

<style scoped>
.new-notification {
  background-color: aquamarine;
}
.button-pop {
  position: relative;
}

.settings-popup,
.notification-popup,
.user-popup {
  position: absolute;
  top: 110%;
  right: 0%;
  direction: ltr;
  display: inline-block;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  width: max-content;
}

@keyframes jump {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}

.jump-animation {
  animation: jump 1s ease;
}
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
.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 10px;
  font-family: math;
  text-decoration: none;
  color: #000;
}
</style>
