<template>
  <div style="margin: 0 auto" class="width62">
    <h1>Register WordPress Website</h1>

    <label for="wordpressUrl">WordPress URL:</label>
    <input type="text" id="wordpressUrl" v-model="wordpressUrl" required />
    <button @click="registerSite">Register</button>

    <div v-if="!posts.length && !pages.length && !categories.length">
      <p v-if="loadingData">Loading...</p>
    </div>
    <div v-else class="flexed div-ul">
      <div v-if="posts.length">
        <h4>Posts:</h4>
        <ul>
          <li v-for="(post, index) in posts" :key="index">{{ post.title }}</li>
        </ul>
      </div>
      <div v-if="pages.length">
        <h4>Pages:</h4>
        <ul>
          <li v-for="(page, index) in pages" :key="index">{{ page.title }}</li>
        </ul>
      </div>
      <div v-if="categories.length">
        <h4>Categories:</h4>
        <ul>
          <li v-for="(category, index) in categories" :key="index">
            {{ category.name }}
          </li>
        </ul>
      </div>
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
      loadingData: false,
      loadingMsg:
        "Please do not close this window until the process is complete. This may take a few minutes.",
      updatingMsg:
        "please wait while we update your site data. This may take a few minutes.",
      wordpressUrl: "",
      pages: [],
      posts: [],
      categories: [],
    };
  },
  methods: {
    async registerSite() {
      let self = this;
      self.loadingData = true;
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
            let title = post.title.rendered.replace("rendered:", "");
            let content = post.content.rendered
              .replace(/<[^>]*>?/gm, "")
              .replace("rendered:", "");
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
          this.loadingData = false;
          self.posts = posts;
          self.pages = pages;
          self.categories = categories;
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
<style scoped>
ul{
    margin-left: -2vh;
    width: 90%;
}
li{
    margin: 1vh 0;
}

.div-ul{
    height: 40vh;
    overflow-x: clip;
    overflow-y: auto;
    margin-top: 0%;
}
</style>