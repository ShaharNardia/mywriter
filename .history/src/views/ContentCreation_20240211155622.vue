<template>
  <div>
    <div class="form-group">
      <label for="title" class="form-label">{{ language == "hebrew" ? "נושא התוכן" : language == "english" ? "Title" : ""}}:</label>
      <input type="text" id="title" v-model="promptParams.title" required />
    </div>

    <div class="form-group">
      <label for="purpose" class="form-label">{{ language == "hebrew" ? "עבור פלטפורמה" : language == "english" ? "Purpose" : "" }}:</label>
      <select id="purpose" v-model="promptParams.purpose" required>
        <option value="api" selected>{{ language == "hebrew" ? "תגובת API" : language == "english" ? "API Response" : "" }}</option>
        <option value="email">{{ language == "hebrew" ? "דוא\"ל" : language == "english" ? "Email" : "" }}</option>
        <option value="sms">{{ language == "hebrew" ? "SMS" : language == "english" ? "SMS" : "" }}</option>
        <option value="social">{{ language == "hebrew" ? "פוסט ברשתות חברתיות" : language == "english" ? "Social Media Post" : "" }}</option>
        <option value="assignment">{{ language == "hebrew" ? "מטלה אקדמית" : language == "english" ? "Academic Assignment" : "" }}</option>
        <option value="blog">{{ language == "hebrew" ? "בלוג" : language == "english" ? "Blog" : "" }}</option>
      </select>
    </div>

    <div class="form-group">
      <label for="useEmojis" class="form-label">{{ language == "hebrew" ? "השתמש באימוג'ים" : language == "english" ? "Use Emojis" : "" }}</label>
      <select id="useEmojis" v-model="promptParams.useEmojis" class="input-select">
        <option value="true">{{ language == "hebrew" ? "כן" : language == "english" ? "Yes" : "" }}</option>
        <option value="false">{{ language == "hebrew" ? "לא" : language == "english" ? "No" : "" }}</option>
      </select>
    </div>

    <div class="form-group">
      <label for="language" class="form-label">{{ language == "hebrew" ? "שפה" : language == "english" ? "Language" : "" }}:</label>
      <input type="text" id="language" v-model="promptParams.language" required />
    </div>

    <div class="form-group">
      <label for="tone" class="form-label">{{ language == "hebrew" ? "טון" : language == "english" ? "Tone" : "" }}:</label>
      <select id="tone" v-model="promptParams.tone" required>
        <option value="formal">{{ language == "hebrew" ? "רשמי" : language == "english" ? "Formal" : "" }}</option>
        <option value="casual">{{ language == "hebrew" ? "לא רשמי" : language == "english" ? "Casual" : "" }}</option>
        <option value="professional">{{ language == "hebrew" ? "מקצועי" : language == "english" ? "Professional" : "" }}</option>
        <option value="friendly" selected>{{ language == "hebrew" ? "חברותי" : language == "english" ? "Friendly" : "" }}</option>
      </select>
    </div>

    <div class="form-group">
      <label for="email" class="form-label">{{ language == "hebrew" ? "שלח לדוא\"ל (לא חובה)" : language == "english" ? "Send to Email (not mandatory)" : "" }}</label>
      <input type="text" id="email" v-model="promptParams.email" />
    </div>

    <div class="form-group">
      <button @click="generateContent" class="form-button">
        {{ language == "hebrew" ? "צור תוכן" : language == "english" ? "Generate Content" : "" }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['language']),
  },
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
      console.log(
        "Generating content with the following parameters:",
        self.promptParams
      );
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
          {
            headers,
          }
        );
        console.log(response.data);
        this.$router.push(`/content-page/${response.data.id}`);
      } catch (error) {
        console.error("Error calling OpenAI API:", error.message);
      }
    },
  },
};
</script>

<style scoped>
.align-left {
  text-align: left;
}
.form-group {
  display: flex;
  align-items: center;
  margin: 20px 0;
  font-size: 1.2em;
}

.form-label {
  margin-right: 10px;
  width: 200px; /* adjust this value as needed */
}

input,
select {
  width: 50%; /* adjust this value as needed */
  height: 30px;
  padding: 5px;
  font-size: 14px;
  padding-block: 1px;
  padding-inline: 2px;
  font-size: 1em; /* adjust this value as needed */
  font-family: Arial, sans-serif; /* adjust this value as needed */
  color: black;
}

.input-checkbox {
  height: 30px;
  width: auto; /* adjust this value as needed */
}

.form-label-checkbox {
  margin-left: 5px;
}

.form-button {
  margin: 0 auto;
}
</style>
