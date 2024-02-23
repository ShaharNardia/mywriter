<template>
  <div style="margin: 0 auto" class="width22">
    <h1>Register WordPress Website</h1>
    <form @submit.prevent="registerSite">
      <label for="wordpressUrl">WordPress URL:</label>
      <input type="text" id="wordpressUrl" v-model="wordpressUrl" required />
      <button type="submit">Register</button>
    </form>

    <div v-if="posts.length"> 
        <h2>Posts:</h2>
        <ul>
          <li v-for="(post, index) in posts" :key="index">{{ post.title }}</li>
        </ul>
    </div>
    <div v-if="pages.length"> 
        <h2>Pages:</h2>
        <ul>
          <li v-for="(page, index) in pages" :key="index">{{ page.title }}</li>
        </ul>
    </div>
    <div v-if="categories.length"> 
        <h2>Categories:</h2>
        <ul>
          <li v-for="(category, index) in categories" :key="index">{{ category.name }}</li>
        </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { db } from "../main.js";
import { collection, addDoc, getDocs, where, query } from "firebase/firestore";

export default {
  data() {
    return {
      wordpressUrl: "",
      pages: [],
      posts: [],
      categories: [],
    };
  },
  methods: {
    async registerSite() {
      let self = this;
      try {
        const userToken = localStorage.getItem("userToken");
        //const token = 'your_token_here'; // Replace with your token

        // Validate WordPress URL
        if (!this.isValidUrl(this.wordpressUrl)) {
          alert("Please enter a valid WordPress URL");
          return;
        }
        const colRef = collection(db, "WpUserSite");
        const q = query(
          colRef,
          where("userToken", "==", userToken),
          where("url", "==", this.wordpressUrl)
        );
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        if (!querySnapshot.empty) {
          // Document with same userToken and url already exists
          axios
            .post(
              "https://us-central1-mywriter-48a45.cloudfunctions.net/getWordpresspostPageCategoryLists",
              { userToken: userToken, url: self.wordpressUrl }
            ) // Replace 'your_api_endpoint' with the actual endpoint of your API
            .then((response) => {
                self.posts = response.data.wpSitePosts || [];
                self.pages = response.data.wpSitePages || [];
                self.categories = response.data.wpSiteCategories || [];
              console.log(response); // Handle the data as needed
            })
            .catch((error) => {
              console.error("Error getting lists from collections:", error);
            });

          //   await axios
          //     .get(
          //       "",
          //       { userToken: userToken, url: this.wordpressUrl }
          //     )
          //     .then((res) => {
          //       console.log(res);
          //     });
          // Handle the response as needed
        } else {
          await addDoc(colRef, {
            adminToken: "",

            created: new Date(),
            userToken,
            url: this.wordpressUrl,
          });

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
            const colRef = collection(db, "WpSiteCategories");
            await addDoc(colRef, {
              ...category,
              userToken,
              url: this.wordpressUrl,
            });
          });

          posts.forEach(async (post) => {
            const colRef = collection(db, "WpSitePosts");
            let title = { title: post.title.rendered.replace("rendered:", "") };
            let content = {
              content: post.content.rendered
                .replace(/<[^>]*>?/gm, "")
                .replace("rendered:", ""),
            };
            await addDoc(colRef, {
              title,
              content,
              userToken,
              url: this.wordpressUrl,
            });
          });

          pages.forEach(async (page) => {
            const colRef = collection(db, "WpSitePages");
            let title = page.title.rendered.replace("rendered:", "");
            let content = page.content.rendered
              .replace(/<[^>]*>?/gm, "")
              .replace("rendered:", "");
            await addDoc(colRef, {
              title,
              content,
              userToken,
              url: this.wordpressUrl,
            });
          });
        }
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
