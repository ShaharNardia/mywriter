<template>
  <div>
    <form @submit="generateContent">
      <label for="title">Title:</label>
      <input type="text" id="title" v-model="promptParams.title" required />

      <label for="purpose">Purpose:</label>
      <select id="purpose" v-model="promptParams.purpose" required>
        <option value="api" selected>API Response</option>
        <option value="email">Email</option>
        <option value="sms">SMS</option>
        <option value="social">Social Media Post</option>
        <option value="assignment">Academic Assignment</option>
        <option value="blog">Blog</option>
      </select>

      <label for="useEmojis">Use Emojis:</label>
      <input type="checkbox" id="useEmojis" v-model="promptParams.useEmojis" />

      <label for="language">Language:</label>
      <input
        type="text"
        id="language"
        v-model="promptParams.language"
        required
      />

      <label for="tone">Tone:</label>
      <select id="tone" v-model="promptParams.tone" required>
        <option value="formal">Formal</option>
        <option value="casual">Casual</option>
        <option value="professional">Professional</option>
        <option value="friendly" selected>Friendly</option>
        <option value="persuasive">Persuasive</option>
        <option value="informative">Informative</option>
        <option value="humor">Humor</option>
        <option value="academic">Academic</option>
        <option value="business">Business</option>
      </select>

      <label for="email">Send to Email:(not mandatory)</label>
      <input type="text" id="email" v-model="promptParams.email" />

      <button type="submit">Generate Content</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      promptParams: {
        title: "",
        purpose: "api",
        useEmojis: false,
        language: "Hebrew",
        tone: "friendly",
      },
    };
  },
  methods: {
    async generateContent() {
      let self = this;
      let data = {
        promptParams: {
          title: self.promptParams.title,
          purpose: self.promptParams.purpose,
          useEmojis: self.promptParams.useEmojis,
          language: self.promptParams.language,
          tone: self.promptParams.tone,
          email: self.promptParams.email,
        },
      };

      // let config = {
      //   method: "post",
      //   maxBodyLength: Infinity,
      //   url: "https://generatecontent-ibnrirhwvq-uc.a.run.app",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   data: data,
      // };

      const headers = {
        "Content-Type": "application/json"
       // Authorization: `Bearer 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`,
      };

      try {
        // Make the POST request and await the response
        const response = await axios.post(
          "https://generatecontent-ibnrirhwvq-uc.a.run.app",
          data,
          { headers }
        );
        console.log(response.data);
        return response.data; // Return the response data
      } catch (error) {
        // Handle any errors that occur during the request
        console.error("Error calling OpenAI API:", error.message);
        throw error; // Rethrow the error after logging it
      }
    },
  },
};
</script>
