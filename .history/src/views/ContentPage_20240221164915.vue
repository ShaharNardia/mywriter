<template>
  <div class="align-center">
    <div v-if="!document.title">Loading... </div>
    <div class="width62" v-else :class="document.language === 'hebrew' ? 'rtl' : 'ltr'">
      <h1>{{ document.title }}</h1>
      <p>{{ document }}</p>
    </div>
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
      return response.data;
    }).catch((error) => {
      console.error(error);
    });

  },
  },
  mounted() {
    const documentId = this.$route.params.documentId; // Assuming you are using Vue Router and the document ID is passed as a route parameter
    this.fetchContent(documentId);
  },
};
</script>
<style>

</style>
