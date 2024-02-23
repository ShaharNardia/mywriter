<template>
  <div :class="document.language === 'hebrew' ? 'rtl' : 'ltr'">
    <h1>{{ document.title }}</h1>
    <p>{{ document.content }}</p>
  </div>
</template>

<script>
import { db } from "../main.js";
import { doc, getDoc } from 'firebase/firestore';

export default {
  name: "ContentPage",
  data() {
    return {
      document: {
        title: "",
        content: "",
      },
    };
  },
  methods: {
    async fetchContent(documentId) {
    const documentRef = doc(db, "generatedContent", documentId);

    const documentSnapshot = await getDoc(documentRef);
    if (documentSnapshot.exists()) {
      this.document = documentSnapshot.data();
      console.log('Document data:', documentSnapshot.data());
    } else {
      console.log('No such document!');
    }
  },
  },
  mounted() {
    const documentId = this.$route.params.documentId; // Assuming you are using Vue Router and the document ID is passed as a route parameter
    console.log(documentId);
    // Fetch the document from Firestore
    this.fetchContent(documentId);
  },
};
</script>
<style>

</style>
