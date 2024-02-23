<template>
  <div class="width62">
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <div v-for="generatedContent in contents" :key="generatedContent.id">
        <router-link 
        v-if="generatedContent.status == 'success'"
                  :to="`/content-page/${generatedContent.id}`"
                  :class="generatedContent.language === 'hebrew' ? 'rtl' : 'ltr'"
          style="text-decoration: none; color: green"
        >
          <div 
           style="margin: 20px 0">
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

        <div 
        v-else-if="generatedContent.status == 'pending'"
          style="text-decoration: none; color: gray"
          :class="generatedContent.language === 'hebrew' ? 'rtl' : 'ltr'"
        >
          <div 
           style="margin: 20px 0">
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
        </div>
      
        <div v-else
          style="text-decoration: none; color: red"
          :class="generatedContent.language === 'hebrew' ? 'rtl' : 'ltr'"
        >
          <div 
           style="margin: 20px 0">
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { db } from "../main.js";
import { collection, where, query, onSnapshot } from "firebase/firestore";
import { onUnmounted } from 'vue';

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
    fetchContents() {
    this.isLoading = true;
    let userToken = localStorage.getItem("userToken");
    const purchaseHistoryRef = collection(db, "generatedContent");

    const q = query(purchaseHistoryRef, where("userToken", "==", userToken));

    // Listen for changes in the Firestore collection
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.contents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // this.$toast.success('Contents fetched successfully!');
      this.isLoading = false;
    });

    // Call unsubscribe when the component is unmounted
    onUnmounted(unsubscribe);
  },
  },
};
</script>