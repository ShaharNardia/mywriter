<template>
  <div :class="document.language === 'hebrew' ? 'rtl' : 'ltr'">
    <h1>{{ document.title }}</h1>
    <p>{{ document.content }}</p>
  </div>
</template>

<script>
import axios from "axios";
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
    const userToken = localStorage.getItem('userToken');
    axios.get('https://getcontentbyid-ibnrirhwvq-uc.a.run.app', {
      params: {
        userToken: userToken,
        documentId: documentId
      }
    }).then((response) => {
      this.document = response.data;

      console.log(response.data);
      return response.data;
    }).catch((error) => {
      console.error(error);
    });

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
