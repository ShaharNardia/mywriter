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
import { doc, setDoc } from "firebase/firestore";

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
        //const token = 'your_token_here'; // Replace with your token

        // Validate WordPress URL
        if (!this.isValidUrl(this.wordpressUrl)) {
          alert("Please enter a valid WordPress URL");
          return;
        }

        const fetchAllItems = async (endpoint, fields) => {
          let items = [];
          let page = 1;
          let run = true;
          while (run) {
            const res = await axios.get(
              `${this.wordpressUrl}${endpoint}?per_page=100&page=${page}&_fields=${fields}`
            );
            // console.log(res.data);
            items = items.concat(res.data);
            console.log(items);
            // If less than the maximum number of items are returned, we've reached the last page
            if (res.data.length < 100) {
              run = false;
              break;
            }

            page++;
          }

          return items;
        };

        const [categories, posts, pages] = await Promise.all([
          fetchAllItems("/wp-json/wp/v2/categories", "name,description"),
          fetchAllItems("/wp-json/wp/v2/posts", "title,content"),
          fetchAllItems("/wp-json/wp/v2/pages", "title,content"),
        ]);

        categories.forEach(async (category) => {
          const docRef = doc(db, "userWpSiteCategories");
          await setDoc(docRef, {
            ...category,
            userToken,
            url: this.wordpressUrl,
          });
        });

        posts.forEach(async (post) => {
          const docRef = doc(db, "userWpSitePosts");
          let title = { title: post.title.rendered.replace("rendered:", "") };
          let content = {
            content: post.content.rendered
              .replace(/<[^>]*>?/gm, "")
              .replace("rendered:", ""),
          };
          await setDoc(docRef, {
            title,
            content,
            userToken,
            url: this.wordpressUrl,
          });
        });

        pages.forEach(async (page) => {
          const docRef = doc(db, "userWpSitePages");
          let title = { title: page.title.rendered.replace("rendered:", "") };
          let content = {
            content: page.content.rendered
              .replace(/<[^>]*>?/gm, "")
              .replace("rendered:", ""),
          };
          await setDoc(docRef, {
            title,
            content,
            userToken,
            url: this.wordpressUrl,
          });
        });
      } catch (error) {
        console.error("Error registering user site:", error);
        alert("Failed to register user site");
      }
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
