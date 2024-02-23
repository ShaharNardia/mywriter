<template>
  <div style="margin: 0 auto" class="width22">
    <h1>Register WordPress Website</h1>
    <form @submit.prevent="registerSite">
      <label for="wordpressUrl">WordPress URL:</label>
      <input type="text" id="wordpressUrl" v-model="wordpressUrl" required />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { db } from "../main.js";
export default {
  data() {
    return {
      wordpressUrl: "",
    };
  },
  methods: {
    async registerSite() {
        try {
            const userToken = localStorage.getItem("userToken");

            if (!this.isValidUrl(this.wordpressUrl)) {
                alert("Please enter a valid WordPress URL");
                return;
            }

            const endpoints = ["/wp-json/wp/v2/categories", "/wp-json/wp/v2/posts", "/wp-json/wp/v2/pages"];
            const [categories, posts, pages] = await Promise.all(endpoints.map(this.fetchAllItems));

            this.saveToFirestore('userWpSiteCategories', categories, userToken);
            this.saveToFirestore('userWpSitePosts', posts, userToken, this.processPostPageData);
            this.saveToFirestore('userWpSitePages', pages, userToken, this.processPostPageData);

        } catch (error) {
            console.error("Error registering user site:", error);
            alert("Failed to register user site");
        }
    },

    async fetchAllItems(endpoint) {
        let items = [];
        let page = 1;
        let run = true;
        while (run) {
            const res = await axios.get(`${this.wordpressUrl}${endpoint}?per_page=100&page=${page}`);
            items = items.concat(res.data);
            if (res.data.length < 100) {
                run = false;
            }
            page++;
        }
        return items;
    },

    saveToFirestore(collectionName, items, userToken, processData = null) {
        const batch = db.batch();
        items.forEach((item) => {
            const docRef = db.collection(collectionName).doc();
            item = processData ? processData(item) : item;
            batch.set(docRef, { ...item, userToken, url: this.wordpressUrl });
        });
        return batch.commit();
    },

    processPostPageData(item) {
        let title = { title: item.title.rendered.replace("rendered:", "") };
        let content = {
            content: item.content.rendered
                .replace(/<[^>]*>?/gm, "")
                .replace("rendered:", ""),
        };
        return { title, content };
    },

    isValidUrl(url) {
        const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
        return urlRegex.test(url);
    },
    isValidUrl(url) {
      // Implement your URL validation logic here
      // For example, you can use a regular expression
      const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
      return urlRegex.test(url);
    },
  },
};
</script>
