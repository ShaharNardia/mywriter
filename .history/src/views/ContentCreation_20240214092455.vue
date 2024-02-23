<template>
    <div v-if="loading" class="loader">Loading...</div>

  <div>
    <div class="form-group">
      <label for="title" class="form-label"
        >{{
          language == "hebrew"
            ? "נושא התוכן"
            : "Title"
        }}:</label
      >
      <input type="text" id="title" v-model="promptParams.title" required />
    </div>

    <div class="form-group">
      <label for="purpose" class="form-label"
        >{{
          language == "hebrew"
            ? "עבור פלטפורמה"
            : "Purpose"
        }}:</label
      >
      <select id="purpose" v-model="promptParams.purpose" required>
        <option value="api" selected>
          {{
            language == "hebrew"
              ? "תגובת API"
              : "API Response"
          }}
        </option>
        <option value="email">
          {{
            language == "hebrew"
              ? 'דוא"ל'
              : "Email"
          }}
        </option>
        <option value="sms">
          SMS
        </option>
        <option value="social">
          {{
            language == "hebrew"
              ? "פוסט ברשתות חברתיות"
              : "Social Media Post"
          }}
        </option>
        <option value="assignment">
          {{
            language == "hebrew"
              ? "מטלה אקדמית"
              : "Academic Assignment"
          }}
        </option>
        <option value="blog">
          {{
            language == "hebrew" ? "בלוג" : "Blog" 
          }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="useEmojis" class="form-label">{{
        language == "hebrew"
          ? "השתמש באימוג'ים"
          : "Use Emojis"
      }}</label>
      <select
        id="useEmojis"
        v-model="promptParams.useEmojis"
        class="input-select"
      >
        <option value="true">
          {{ language == "hebrew" ? "כן" : "Yes"  }}
        </option>
        <option value="false">
          {{ language == "hebrew" ? "לא" : "No"  }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="language" class="form-label"
        >{{
          language == "hebrew"
            ? "שפה"
            : "Language"
        }}:</label
      >
      <select
        id="language"
        v-model="promptParams.language"
        class="input-select"
      >
        <option value="hebrew">
          {{ language == "hebrew" ? "עברית" : "Hebrew" }}
        </option>
        <option value="english">
          {{ language == "hebrew" ? "אנגלית" : "English" }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="tone" class="form-label"
        >{{
          language == "hebrew" ? "טון" : language == "english" ? "Tone" : ""
        }}:</label
      >
      <select id="tone" v-model="promptParams.tone" required>
        <option value="formal">
          {{
            language == "hebrew"
              ? "רשמי"
              : "Formal"
          }}
        </option>
        <option value="casual">
          {{
            language == "hebrew"
              ? "לא רשמי"
              : "Casual"
          }}
        </option>
        <option value="professional">
          {{
            language == "hebrew"
              ? "מקצועי"
              : "Professional"
          }}
        </option>
        <option value="friendly" selected>
          {{
            language == "hebrew"
              ? "חברותי"
              : "Friendly"
          }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="email" class="form-label">{{
        language == "hebrew"
          ? 'שלח לדוא"ל (לא חובה)'
          : "Send to Email (not mandatory)"
      }}</label>
      <input type="text" id="email" v-model="promptParams.email" />
    </div>

    <div class="form-group">
      <button @click="generateContent" class="form-button">
        {{ language == "hebrew" ? "צור תוכן" : "Generate Content" }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
// Removed the unused import statement

export default {
  computed: {
    ...mapState(["language"]),
  },
  data() {
    return {
      loading: false, // add a loading state
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
      self.loading = true; // set loading to true when the function starts

      console.log(
        "Generating content with the following parameters:",
        self.promptParams
      );
      let data = {
        userToken : localStorage.getItem("userToken"),
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
        this.loading = false; // set loading to false when the function completes
        if (response.status === 200) {
          this.$toasted.show('We are processing your request - please wait', { 
            duration: 5000,
          });
        }

        console.log(response.data);
        this.promptParams = {
          title: "",
          purpose: "api",
          useEmojis: false,
          language: "Hebrew",
          tone: "friendly",
        };

        console.log(response.data);
        //this.$router.push(`/content-page/${response.data.id}`);
      } catch (error) {
        this.loading = false; // set loading to false even if there's an error
        console.error("Error calling OpenAI API:", error.message);
      }
    },
  },
};
</script>

<style scoped>

.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

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
