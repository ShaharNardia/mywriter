<template>
  <div class="align-center">
    <div v-if="!document.title">Loading...</div>
    <div
      class="width62"
      v-else
      :class="document.language === 'hebrew' ? 'rtl' : 'ltr'"
    >
      <div v-if="document.type == 'blog'" v-html="document.content"></div>
      <div v-else-if="document.type == 'API Response (-JSON Format)'">
       <div style="margin-bottom: 5%;">
        <div @click="raw(true)" :class="raw? 'selected' : ''">raw</div>
        <div @click="raw(false)" :class="raw? 'selected' : ''">plain</div>
      </div>
        <h1>{{ document.title }}</h1>
        <div v-if="raw">
          {{ document.content }}
        </div>
        <tree-view :data="JSON.parse(document.content)"></tree-view>
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
import TreeView from "../components/TreeView.vue";

export default {
  name: "ContentPage",
  components: {
    TreeView,
  },
  data() {
    return {
      raw: false,
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
