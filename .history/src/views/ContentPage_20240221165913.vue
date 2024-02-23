<template>
  <div class="align-center">
    <div v-if="!document.title">Loading...</div>
    <div
      class="width62"
      v-else
      :class="document.language === 'hebrew' ? 'rtl' : 'ltr'"
    >
      <div v-if="document.type == 'blog'" v-html="document.content"></div>
      <div
        v-else-if="document.type == 'API Response (-JSON Format)'"
        class="tree-view"
      >
        <h1>{{ document.title }}</h1>
        <ul>
          <tree-node
            v-for="(value, name) in data"
            :key="name"
            :name="name"
            :value="value"
          ></tree-node>
        </ul>
      </div>
      <div v-else>
        <h1>{{ document.title }}</h1>
        <div>{{ document.content }}</div>
      </div>
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
      const userToken = localStorage.getItem("userToken");
      axios
        .get("https://getcontentbyid-ibnrirhwvq-uc.a.run.app", {
          params: {
            userToken: userToken,
            documentId: documentId,
          },
        })
        .then((response) => {
          this.document = response.data;
          return response.data;
        })
        .catch((error) => {
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
<style></style>
