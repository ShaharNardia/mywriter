<template>
  <div>
    <h1>{{ document.title }}</h1>
    <p>{{ document.content }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase'; // Assuming you have set up Firebase in your project

export default {
  name: 'ContentPage',
  data() {
    return {
      document: {
        title: '',
        content: ''
      }
    };
  },
  mounted() {
    const documentId = this.$route.params.documentId; // Assuming you are using Vue Router and the document ID is passed as a route parameter

    // Fetch the document from Firestore
    const fetchDocument = async () => {
      try {
        const docRef = db.collection('generatedContent').doc(documentId);
        const doc = await docRef.get();
        if (doc.exists) {
          this.document.title = doc.data().title;
          this.document.content = doc.data().content;
        } else {
          console.log('Document not found');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    onMounted(fetchDocument);
  }
};
</script>

<style>
/* Add your custom styles here */
</style>
