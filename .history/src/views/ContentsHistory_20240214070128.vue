<template>
  <div>
    <div v-for="generatedContent in contents" :key="generatedContent.id">
      <router-link
        :to="`/content-page/${generatedContent.id}`"
        style="text-decoration: none; color: black"
      >
        <div style="margin: 20px 0">
          <div style="margin-bottom: 10px">
            {{ generatedContent.title.slice(0, 100) }}...
          </div>
          <div style="margin-bottom: 10px">
            {{
              new Date(generatedContent.created.seconds * 1000).toLocaleString()
            }}
          </div>
          <span style="font-weight: bold">{{ generatedContent.language }}</span>
          | <span style="font-weight: bold">{{ generatedContent.tone }}</span> |
          <span style="font-weight: bold">{{ generatedContent.type }}</span> |
        </div>
        <hr />
      </router-link>
    </div>
  </div>
</template>

<script>
import { db } from "../main.js";
import { query } from "firebase/firestore";
import { collection, getDocs, where } from "firebase/firestore";

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
    async fetchContents(uuid) {
      const purchaseHistoryRef = collection(db, "generatedContent");

      const query = query(purchaseHistoryRef, where("userToken", "==", uuid));

      const querySnapshot = await getDocs(query);
      this.contents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(this.contents);
    },
  },
};
</script>
