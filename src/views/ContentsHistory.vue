<template>
  <div class="main-container">
    <div class="toggle-container">
      <label for="archived-switch">Show Archived Content</label>
      <input id="archived-switch" type="checkbox" v-model="showArchived" />
    </div>
    <div class="grid-container">
      <div v-if="isLoading" class="loading">Loading...</div>

      <div
        v-else-if="archivedContent.length === 0 && showArchived"
        class="content-item"
        style="text-align: center"
      >
        No archived content found.
      </div>
      <div
        v-else-if="contents.length === 0 && !showArchived"
        class="content-item"
        style="text-align: center"
      >
        No content found.
      </div>

      <div
        v-else-if="!showArchived"
        class="content-item"
        v-for="generatedContent in contents"
        :key="generatedContent.id"
        :class="generatedContent.language === 'english' ? 'ltr' : 'rtl'"
      >
        <div class="close-button" @click="archiveContent(generatedContent.id)">
          X
        </div>
        <router-link
          v-if="generatedContent.status == 'success'"
          :to="`/content-page/${generatedContent.id}`"
          class="link-success"
        >
          <div class="content-title">
            {{ generatedContent.title.slice(0, 100) }}...
          </div>
          <div class="content-date">
            {{
              new Date(generatedContent.created.seconds * 1000).toLocaleString()
            }}
          </div>
          <div class="content-meta">
            <span>{{
              generatedContent.language === "english" ? "english" : "hebrew"
            }}</span>
            |
            <span>{{
              generatedContent.tone === undefined
                ? "cloned"
                : generatedContent.tone
            }}</span>
            |
            <span>{{
              generatedContent.type === undefined
                ? "blog"
                : generatedContent.type
            }}</span>
          </div>
        </router-link>
        <div
          v-else-if="generatedContent.status == 'pending'"
          class="link-pending"
        >
          <div class="content-title">
            {{ generatedContent.title.slice(0, 100) }}...
          </div>
          <div class="content-date">
            {{
              new Date(generatedContent.created.seconds * 1000).toLocaleString()
            }}
          </div>
          <div class="content-meta">
            <span>{{
              generatedContent.language === "english" ? "english" : "hebrew"
            }}</span>
            |
            <span>{{
              generatedContent.tone === undefined
                ? "cloned"
                : generatedContent.tone
            }}</span>
            |
            <span>{{
              generatedContent.type === undefined
                ? "blog"
                : generatedContent.type
            }}</span>
          </div>
        </div>
        <div v-else class="link-error">
          <div class="content-title">
            {{ generatedContent.title.slice(0, 100) }}...
          </div>
          <div class="content-date">
            {{
              new Date(generatedContent.created.seconds * 1000).toLocaleString()
            }}
          </div>
          <div class="content-meta">
            <span>{{ generatedContent.language }}</span> |
            <span>{{ generatedContent.tone }}</span> |
            <span>{{ generatedContent.type }}</span>
          </div>
        </div>
      </div>
      <div
        v-else-if="showArchived"
        class="content-item"
        v-for="generatedContent in archivedContent"
        :key="generatedContent.created.seconds"
        :class="generatedContent.language === 'english' ? 'ltr' : 'rtl'"
      >
        <div
          class="close-button"
          @click="unarchiveContent(generatedContent.id)"
        >
          +
        </div>
        <router-link
          v-if="generatedContent.status == 'success'"
          :to="`/content-page/${generatedContent.id}`"
          class="link-success"
        >
          <div class="content-title">
            {{ generatedContent.title.slice(0, 100) }}...
          </div>
          <div class="content-date">
            {{
              new Date(generatedContent.created.seconds * 1000).toLocaleString()
            }}
          </div>
          <div class="content-meta">
            <span>{{
              generatedContent.language === "english" ? "english" : "hebrew"
            }}</span>
            |
            <span>{{
              generatedContent.tone === undefined
                ? "cloned"
                : generatedContent.tone
            }}</span>
            |
            <span>{{
              generatedContent.type === undefined
                ? "blog"
                : generatedContent.type
            }}</span>
          </div>
        </router-link>
        <div
          v-else-if="generatedContent.status == 'pending'"
          class="link-pending"
        >
          <div class="content-title">
            {{ generatedContent.title.slice(0, 100) }}...
          </div>
          <div class="content-date">
            {{
              new Date(generatedContent.created.seconds * 1000).toLocaleString()
            }}
          </div>
          <div class="content-meta">
            <span>{{
              generatedContent.language === "english" ? "english" : "hebrew"
            }}</span>
            |
            <span>{{
              generatedContent.tone === undefined
                ? "cloned"
                : generatedContent.tone
            }}</span>
            |
            <span>{{
              generatedContent.type === undefined
                ? "blog"
                : generatedContent.type
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../main.js";
import { getAuth } from "firebase/auth";
import {
  orderBy,
  collection,
  where,
  query,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

export default {
  data() {
    return {
      contents: [],
      archivedContent: [],
      showArchived: false,
      isLoading: false,
      unsubscribe: null, // Storing the unsubscribe function
    };
  },
  mounted() {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.fetchContents();
      } else {
        // Redirect to login or handle unauthenticated state
        this.$router.push("/login");
      }
    });
  },
  beforeUnmount() {
    // Properly unsubscribe from the Firestore collection when the component is destroyed
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    archiveContent(contentId) {
      const content = this.contents.find((c) => c.id === contentId);
      if (content) {
        content.archived = true;
        // Optionally, send this update back to the server or database if needed
        this.updateContentStatus(contentId, true);
      }
    },
    unarchiveContent(contentId) {
      const content = this.archivedContent.find((c) => c.id === contentId);
      if (content) {
        content.archived = false;
        // Optionally, send this update back to the server or database if needed
        this.updateContentStatus(contentId, false);
      }
    },
    updateContentStatus(contentId, archived) {
      // Assuming `db` is your Firestore instance and `generatedContent` is your collection name
      const contentRef = doc(db, "generatedContent", contentId);

      updateDoc(contentRef, {
        archived: archived,
      })
        .then(() => {
          console.log("Content archived status updated.");
        })
        .catch((error) => {
          console.error("Error updating content:", error);
        });
    },
    fetchContents() {
      this.isLoading = true;
      let userToken = localStorage.getItem("userToken");
      console.log(userToken + " - User Token");
      const purchaseHistoryRef = collection(db, "generatedContent");
      const q = query(
        purchaseHistoryRef,
        where("userToken", "==", userToken),
        orderBy("created", "desc")
      );

      // Listen for changes in the Firestore collection
      this.unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          this.contents = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((generatedContent) => !generatedContent.archived); // This line filters out archived items

          this.archivedContent = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((generatedContent) => generatedContent.archived); // This line filters out archived items
          this.isLoading = false;
        },
        (error) => {
          console.error("Error fetching contents: ", error);
          this.isLoading = false;
          // Optionally, set an error state and show a message to the user
        }
      );
    },
  },
};
</script>
<style scoped>
.close-button {
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  color: red;
  width: fit-content;
  padding: 2px 5px;
  border-radius: 5px;
  border: 1px solid red;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(500px, 1fr)
  ); /* Adjusts number of columns based on available width */
  gap: 20px; /* Space between grid items */
  padding: 20px; /* Padding around the grid */
  background-color: #f0f0f0; /* Optional: background color for the grid container */
}

.content-item {
  position: relative; /* Add this line */
  border: 1px solid #ccc;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Optional: adds shadow for better visibility */
}

.loading,
.content-title,
.content-date,
.content-meta {
  margin: 10px 0;
}

.link-success {
  text-decoration: none; /* Removes underline from links */
  color: green; /* Color for success links */
}

.link-pending {
  text-decoration: none; /* Removes underline from links */
  color: gray; /* Color for pending links */
}

.link-error {
  text-decoration: none; /* Removes relate underline from links */
  color: red; /* Color for error links */
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr; /* Single column layout for smaller screens */
  }
}
</style>
