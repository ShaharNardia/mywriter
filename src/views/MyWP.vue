<template>
  <div style="margin: 20px auto" class="width62">
    <h1>Register your WordPress Website</h1>
    <form @submit.prevent="registerSite">
      <div class="form-group">
        <label for="wordpressUrl">WordPress URL:</label>
        <input type="text" id="wordpressUrl" v-model="wordpressUrl" required />
      </div>
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" :disabled="!isValidForm">Register</button>
    </form>
    <div class="registered-sites">
      <h2>Registered Sites</h2>
      <ul>
        <li v-for="site in registeredSites" :key="site.id">
          <p><strong>URL:</strong> {{ site.url }}</p>
          <p><strong>Username:</strong> {{ site.username }}</p>
          <!-- Consider obscuring or not displaying -->
          <p>
            <strong>Registered On:</strong>
            {{ new Date(site.created.seconds * 1000).toLocaleString() }}
          </p>
        </li>
      </ul>

      <div class="link-container">
        <router-link @click="closePopup" to="/fetch-wp" class="styled-link">
          Get content from another WordPress site
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../main.js";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc,
} from "firebase/firestore";

export default {
  data() {
    return {
      wordpressUrl: "",
      username: "",
      password: "",
      userToken: localStorage.getItem("userToken"), // Assume token is stored in localStorage
      registeredSites: [], // Array to store fetched site data
    };
  },
  computed: {
    isValidForm() {
      return this.wordpressUrl && this.username && this.password;
    },
  },
  methods: {
    async fetchRegisteredSites() {
      const sitesRef = collection(db, "WpUserRegisteredSites");
      console.log(this.userToken);
      const q = query(sitesRef, where("userToken", "==", this.userToken));
      try {
        const querySnapshot = await getDocs(q);
        this.registeredSites = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Failed to fetch registered sites:", error);
      }
    },
    async registerSite() {
      if (this.isValidForm) {
        try {
          const colRef = collection(db, "WpUserRegisteredSites");
          await addDoc(colRef, {
            url: this.wordpressUrl,
            username: this.username,
            password: this.password,
            userToken: this.userToken,
            created: Timestamp.fromDate(new Date()),
          });
          alert("Site registered successfully!");
          this.wordpressUrl = "";
          this.username = "";
          this.password = "";
        } catch (error) {
          console.error("Error registering site:", error);
          alert("Failed to register site.");
        }
      } else {
        alert("Please fill in all fields.");
      }
    },
  },
  created() {
    this.fetchRegisteredSites(); // Initial fetch of registered sites
  },
};
</script>

<style scoped>

.registered-sites {
  margin-top: 50px;
}
ul {
  display: flex;
}
li {
  padding: 0 10% 0 0;
}
.form-group {
  margin-bottom: 20px;
}
.hovered {
  background: rgba(255, 0, 0, 0.5); /* Transparent red */
  color: #fff; /* White */
  cursor: pointer;
}
ul {
  margin-left: -2vh;
  width: 90%;
}
li {
  margin: 1vh 0;
}

.div-ul {
  height: 40vh;
  overflow-x: clip;
  overflow-y: auto;
  margin-top: 0%;
}
</style>
