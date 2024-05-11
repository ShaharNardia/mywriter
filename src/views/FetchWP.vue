<template>
  <div style="margin: 0 auto" class="width62">
    <h1>Fetch posts from any WordPress Website</h1>
    <div class="link-container">
      <router-link @click="closePopup" to="/my-wp" class="styled-link">
        Register your wordpress site/s to create posts automaticly
      </router-link>
    </div>

    <div class="flexed" style="margin-bottom: 0%; vertical-align: middle">
      <div>
        <label for="wordpressUrl">WordPress URL:</label>
        <input type="text" id="wordpressUrl" v-model="wordpressUrl" required />
        <button @click="registerSite">Register</button>
      </div>
    </div>

    <h4 v-if="allItems.length > 0">
      {{ dir == "rtl" ? "מספר פוסטים:" : "Posts number:" }}
      {{ allItems.length }}
    </h4>
    <div v-if="loadingData">
      <p>{{ dir == "ltr" ? "Loading..." : "טוען..." }}</p>
    </div>
    <div v-else class="content-grid" :class="dir == 'rtl' ? 'rtl' : ''">
      <div v-for="(item, index) in allItems" :key="index" class="content-item">
        <div
          style="
            height: 30px;
            background-color: green;
            font-size: larger;
            font-weight: bold;
            text-align: center;
            padding: 7px 0;
          "
        >
          {{ item.date }}
        </div>
        <h4 style="padding: 0px 5px 0px 5px; height: 70px">
          {{ item.title?.rendered || item.name?.rendered }}
        </h4>
        <div style="padding: 5px">
          {{ dir === "rtl" ? "תקציר:" : "Excerpt:" }}
          <div
            style="
              margin: 5px 0;
              height: 200px;
              width: 100%;
              overflow-x: hidden;
              overflow-y: scroll;
            "
            v-html="item?.excerpt?.rendered"
          ></div>
        </div>
        <!-- <div>Content: <div style="height: 200px; max-width: 98%; overflow-y: scroll;background-color: red;" v-html="item?.content?.rendered"></div></div> -->
        <div class="upload-buttons">
          <button @click="uploadToSite(item)">Just create content</button>
          <div
            v-for="site in registeredSites"
            :key="site.id"
            class="upload-button"
          >
            <button @click="uploadToSite(item, site)">
              Upload to {{ site.url.replace(/https?:\/\//, "") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { db } from "../main.js";
import { collection, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { addDoc } from "firebase/firestore";

export default {
  data() {
    return {
      loadingData: false,
      wordpressUrl: "",
      allItems: [],
      registeredSites: [],
      dir: "ltr",
    };
  },
  created() {
    this.fetchRegisteredSites();
  },
  methods: {
    async fetchRegisteredSites() {
      try {
        const querySnapshot = await getDocs(
          collection(db, "WpUserRegisteredSites")
        );
        this.registeredSites = querySnapshot.docs.map((doc) => doc.data());
      } catch (error) {
        console.error("Failed to fetch registered sites:", error);
      }
    },
    async registerSite() {
      this.allItems = [];
      if (!this.wordpressUrl.startsWith("https://")) {
        this.wordpressUrl = `https://${this.wordpressUrl}`;
      }
      if (this.wordpressUrl.includes(".co.il")) {
        this.dir = "rtl";
      }
      if (!this.isValidUrl(this.wordpressUrl)) {
        // Corrected function name here
        alert("Please enter a valid WordPress URL");
        return;
      }
      this.loadingData = true;

      const colRef = collection(db, "WpUserSite");
          await addDoc(colRef, {
            wordpressUrl: this.wordpressUrl,
        userToken: localStorage.getItem("userToken"),

            created: Timestamp.fromDate(new Date()),
          });
      // this.fetchRegisteredSites();
      try {
        const url = `${this.wordpressUrl}/wp-json/wp/v2/`;
        const endpoints = {
          posts: "/posts",
          // Add other endpoints as needed
        };
        await Promise.all(
          Object.entries(endpoints).map(async ([endpoint]) => {
            const items = await this.fetchAllItems(
              `${url}${endpoint}`,
              "id,title,content,excerpt,date"
            );
            if (Array.isArray(items)) {
              const typedItems = items.map((item) => ({ ...item }));
              this.allItems = [...this.allItems, ...typedItems];
              console.log(this.allItems);
            } else {
              console.error("Expected an array but got:", items);
            }
          })
        );
      } catch (error) {
        console.error("Error registering site:", error);
        alert("Failed to register site");
      } finally {
        this.loadingData = false;
      }
    },
    async fetchAllItems(endpoint, fields) {
      let items = [];
      let page = 1;
      let run = true;
      while (run) {
        try {
          const response = await axios.get(
            `${endpoint}?per_page=100&page=${page}&_fields=${fields}`
          );
          if (response.data && Array.isArray(response.data)) {
            items = items.concat(response.data);
            if (response.data.length < 100) {
              run = false; // Stop if the last page
            }
          } else {
            run = false; // Stop if response is not as expected
          }
          page++;
        } catch (error) {
          console.error("Error fetching data:", error);
          run = false; // Stop on fetch error
        }
      }
      return items;
    },
    sendItem(item) {
      console.log(item);
      axios
        .post("https://createwppost-ibnrirhwvq-uc.a.run.app", item)
        .then((response) => {
          console.log(response);
          // Handle the response as needed
        })
        .catch((error) => {
          console.error("Error sending item:", error);
        });
    },

    uploadToSite(item, site) {
      if (!site) {
        item.userToken = localStorage.getItem("userToken");
        item.content = item.content.rendered;
        item.category = "uncategorized";
        item.title = item.title.rendered;
        this.sendItem(item);
        return;
      }
      axios
        .post(`https://example.com/upload`, {
          siteId: site.id,
          postId: item.id,
          userToken: localStorage.getItem("userToken"),
        })
        .then((response) => {
          console.log("Upload successful:", response.data);
          item.uploadedTo = site.id; // Flag the item as uploaded
        })
        .catch((error) => {
          console.error("Upload failed:", error);
        });
    },
    isValidUrl(url) {
      return /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i.test(url);
    },
  },
};
</script>
<style scoped>
.rtl {
  direction: rtl;
  text-align: right;
}
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 20px;
}

.content-item {
  border: 1px solid #ccc;
  padding-bottom: 10px;
}

.upload-buttons {
  text-align: center;
}
.upload-button {
  margin: 10px 5%;
  width: 90%;
}

.button-disabled {
  background-color: lightgreen;
  color: white;
}
</style>
