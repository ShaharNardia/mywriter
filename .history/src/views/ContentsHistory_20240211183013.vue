<template>
  <div>
    <div v-for="generatedContent in contents" :key="generatedContent.id">
      <router-link :to="`/content-page/${generatedContent.id}`" style="text-decoration: none; color:black">
        <div style="margin:20px 0">
          <div style="margin-bottom: 10px;">{{ generatedContent.title.slice(0,150) }}</div> | 
          <span>{{ generatedContent.created }}</span> |
          <span>{{ generatedContent.language }}</span> |
          <span>{{ generatedContent.tone }}</span> |
          <span>{{ generatedContent.type }}</span> |

        </div>
        <hr />
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
