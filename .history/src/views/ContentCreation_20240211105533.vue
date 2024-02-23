<template>
  <div>
    <form @submit="generateContent" class="form">
      <div class="form-group">
        <label for="title" class="form-label">Title:</label>
        <input type="text" id="title" v-model="promptParams.title" required />
      </div>

      <div class="form-group">
        <label for="purpose" class="form-label">Purpose:</label>
        <select id="purpose" v-model="promptParams.purpose" required>
          <option value="api" selected>API Response</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="social">Social Media Post</option>
          <option value="assignment">Academic Assignment</option>
          <option value="blog">Blog</option>
        </select>
      </div>

      <div class="form-group">
        <label for="useEmojis" class="form-label">Use Emojis</label>
        <div class="align-left">
          <input
            type="checkbox"
            id="useEmojis"
            v-model="promptParams.useEmojis"
            class="input-checkbox"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="language" class="form-label">Language:</label>
        <input
          type="text"
          id="language"
          v-model="promptParams.language"
          required
        />
      </div>

      <div class="form-group">
        <label for="tone" class="form-label">Tone:</label>
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
      </div>

      <div class="form-group">
        <label for="email" class="form-label"
          >Send to Email:(not mandatory)</label
        >
        <input type="text" id="email" v-model="promptParams.email" />
      </div>

      <button type="submit" class="form-button">Generate Content</button>
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

      const headers = {
        "Content-Type": "application/json",
      };

      try {
        const response = await axios.post(
          "https://generatecontent-ibnrirhwvq-uc.a.run.app",
          data,
          { headers }
        );
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error("Error calling OpenAI API:", error.message);
        throw error;
      }
    },
  },
};
</script>

<style scoped>
.form {
  font-size: 1.2em;
}
.align-left {
  text-align: left;
}
.form-group {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.form-label {
  margin-right: 10px;
  width: 200px; /* adjust this value as needed */
}

input,
select {
  width: 300px; /* adjust this value as needed */
  height: 30px;
  padding: 5px;
  font-size: 14px;
  padding-block: 1px;
  padding-inline: 2px;
}

.input-checkbox {
  height: 30px;
  width: auto; /* adjust this value as needed */
}

.form-label-checkbox {
  margin-left: 5px;
}

.form-button {
  margin: 20px 0;
}
</style>
