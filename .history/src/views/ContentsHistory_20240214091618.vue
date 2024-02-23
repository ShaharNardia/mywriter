<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
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
                new Date(
                  generatedContent.created.seconds * 1000
                ).toLocaleString()
              }}
            </div>
            <span style="font-weight: bold">{{
              generatedContent.language
            }}</span>
            |
            <span style="font-weight: bold">{{ generatedContent.tone }}</span> |
            <span style="font-weight: bold">{{ generatedContent.type }}</span> |
          </div>
          <hr />
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { db } from "../main.js";
import { collection, getDocs, where, query } from "firebase/firestore";
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      contents: [],
      isLoading: false,
    };
  },
  mounted() {
    this.fetchContents();
  },
  methods: {
    async fetchContents() {
      this.isLoading = true;
      let uuid = localStorage.getItem("uuid");
      const purchaseHistoryRef = collection(db, "generatedContent");

      const q = query(purchaseHistoryRef, where("userToken", "==", uuid));

      try {
        const querySnapshot = await getDocs(q);
        this.contents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(this.contents);
        this.$toast.success('Contents fetched successfully!');
      } catch (error) {
        console.error(error);
        this.$toast.error('Failed to fetch contents!');
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>