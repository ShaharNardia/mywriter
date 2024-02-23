<template>
  <div>
    <div v-for="generatedContent in contents" :key="generatedContent.id">
      <router-link :to="`/content-page/${generatedContent.id}`">
        {{ generatedContent }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { db } from "../main.js";
import { collection, getDocs } from "firebase/firestore";

export default {
  data() {
    return {
      contents: [],
    };
  },
  mounted() {
    this.fetchContents();
  },
  methods: {
    async fetchContents() {
      const purchaseHistoryRef = collection(db, "generatedContent");

      const querySnapshot = await getDocs(purchaseHistoryRef);
      this.contents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(this.contents);
    },
  },
};
</script>
