<template>
  <div v-if="loading" class="loader">Loading...</div>
  <div class="align-center">
    <div class="width22">
      <!-- Title -->
      <div class="form-group">
        <label for="title" class="form-label">{{ language == "hebrew" ? "נושא התוכן" : "Title" }}</label>
        <input type="text" id="title" v-model="promptParams.title" required />
      </div>

      <!-- Purpose (Platforms) - CustomDropdown -->
      <div class="form-group">
        <CustomDropdown :options="platformOptions" v-model="promptParams.purpose" label="Purpose" />
      </div>

      <!-- Goal - CustomDropdown -->
      <div class="form-group">
        <CustomDropdown :options="goalOptions" v-model="promptParams.goal" label="Goal" />
      </div>

      <!-- Use Emojis - CustomDropdown -->
      <div class="form-group">
        <CustomDropdown :options="emojiOptions" v-model="promptParams.useEmojis" label="Use Emojis" />
      </div>

      <!-- Language - CustomDropdown -->
      <div class="form-group">
        <CustomDropdown :options="languageOptions" v-model="promptParams.language" label="Language" />
      </div>

      <!-- Tone - CustomDropdown -->
      <div class="form-group">
        <CustomDropdown :options="toneOptions" v-model="promptParams.tone" label="Tone" />
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email" class="form-label">{{ language == "hebrew" ? 'שלח לדוא"ל (לא חובה)' : "Send to Email (not mandatory)" }}</label>
        <input type="text" id="email" v-model="promptParams.email" />
      </div>

      <!-- Generate Button -->
      <div class="form-group">
        <button @click="generateContent" class="form-button">{{ language == "hebrew" ? "צור תוכן" : "Generate Content" }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import CustomDropdown from './CustomDropdown.vue';

export default {
  components: {
    CustomDropdown
  },
  data() {
    const userPreferences = JSON.parse(localStorage.getItem("user")) || {};
    return {
      loading: false,
      promptParams: {
        title: userPreferences.title || "",
        purpose: userPreferences.platform || "API Response (-JSON Format)",
        goal: userPreferences.goal || "Increase Engagement",
        useEmojis: userPreferences.useEmojis || false,
        language: userPreferences.language || "english",
        tone: userPreferences.tone || "Persuasive",
        email: userPreferences.email || "",
      },
      platforms: JSON.parse(localStorage.getItem("platformsList")) || [],
      goals: JSON.parse(localStorage.getItem("goalsList")) || [],
      tones: JSON.parse(localStorage.getItem("tonesList")) || [],
    };
  },
  computed: {
    language() {
      return this.$store.state.language;
    },
  },
  methods: {
    async generateContent() {
      this.loading = true;
      // Generate content logic here
      this.loading = false;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
