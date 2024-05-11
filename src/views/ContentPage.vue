<template>
  <div class="align-center">
    <div v-if="!document.title">Loading...</div>
    <div
      class="width62"
      v-else
      :class="document.language === 'english' ? 'ltr' : 'rtl'"
    >
      <div
        v-if="
          document.type == 'blog' ||
          document.type == 'Web Content (-HTML Format)'
        "
      >
        <div class="flexed" style="margin-bottom: 5%">
          <div
            @click="raw(true)"
            style="margin: 0 2%"
            :class="isRaw ? 'selected' : ''"
            class="btn"
          >
            Text
          </div>
          <div
            @click="raw(false)"
            :class="!isRaw ? 'selected' : ''"
            class="btn"
          >
            Html
          </div>
        </div>

        <div v-html="document.content" v-if="isRaw"></div>
        <div v-else>
          <h1>{{ document.title }}</h1>
          <div>{{ document.content }}</div>
        </div>
      </div>
      <div
        v-else-if="
          document.type == 'API Response (-JSON Format)' ||
          document.type == null
        "
      >
        <h1>{{ document.title }}</h1>
        <div class="flexed" style="margin-bottom: 5%">
          <div
            @click="raw(true)"
            style="margin: 0 2%"
            :class="isRaw ? 'selected' : ''"
            class="btn"
          >
            JSON
          </div>
          <div
            @click="raw(false)"
            :class="!isRaw ? 'selected' : ''"
            class="btn"
          >
            Text
          </div>
        </div>
        <div v-if="isRaw">
          {{ document.content }}
        </div>
        <tree-view v-else :data="JSON.parse(document.content)"></tree-view>
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
      isRaw: false,
      document: {
        title: "",
        content: "",
      },
    };
  },
  methods: {
    raw(val) {
      this.isRaw = val;
    },
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
          response.data.content = response.data.content
            .replace(/json/g, "") // Global replace 'json'
            .replace(/```/g, "") // Global replace all occurrences of "```"
            .replace(/\\n/g, " ") // Replace all escaped new lines with a space
            .replace(/\\n/g, "") // Removing escaped newlines if not necessary
            .replace(/\n/g, " ") // Replace actual newlines with space
            .replace(/\r/g, " "); // Replace carriage returns if present

          this.document = response.data;
          console.log(this.document.content);
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
<style>
.btn {
  padding: 5px 10px;
  cursor: pointer;
}
.selected {
  color: #fff;
  background-color: #000;
  border-radius: 5px;
}
</style>
