<template>
  <div v-if="loading" class="loader">Loading...</div>
  <div class="align-center">
    <div class="width22">
      <!-- Title -->
      <div class="form-group">
        <label for="title" class="form-label"
          >{{ language == "hebrew" ? "נושא התוכן" : "Title" }}:</label
        >
        <textarea
          id="title"
          v-model="promptParams.title"
          class="input-100"
          required
        ></textarea>
      </div>

      <!-- Purpose (Platforms) -->
      <div class="form-group">
        <label for="purpose" class="form-label"
          >{{ language == "hebrew" ? "עבור פלטפורמה" : "Purpose" }}:</label
        >
        <select id="purpose" v-model="promptParams.purpose" required>
          <option
            v-for="platform in platforms"
            :value="platform.platform"
            :key="platform.id"
          >
            {{ platform.platform }}
          </option>
        </select>
      </div>

      <!-- Goal -->
      <div class="form-group">
        <label for="goal" class="form-label"
          >{{ language == "hebrew" ? "מטרה" : "Goal" }}:</label
        >
        <select id="goal" v-model="promptParams.goal" required>
          <option v-for="goal in goals" :value="goal.goal" :key="goal.id">
            {{ goal.goal }}
          </option>
        </select>
      </div>

      <!-- Use Emojis -->
      <div class="form-group">
        <label for="useEmojis" class="form-label">{{
          language == "hebrew" ? "השתמש באימוג'ים" : "Use Emojis"
        }}</label>
        <select
          id="useEmojis"
          v-model="promptParams.useEmojis"
          class="input-select"
        >
          <option value="true">
            {{ language == "hebrew" ? "כן" : "Yes" }}
          </option>
          <option value="false">
            {{ language == "hebrew" ? "לא" : "No" }}
          </option>
        </select>
      </div>

      <!-- Language -->
      <div class="form-group">
        <label for="language" class="form-label"
          >{{ language == "hebrew" ? "שפה" : "Language" }}:</label
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

      <!-- Tone -->
      <div class="form-group">
        <label for="tone" class="form-label"
          >{{ language == "hebrew" ? "טון" : "Tone" }}:</label
        >
        <select id="tone" v-model="promptParams.tone" required>
          <option v-for="tone in tones" :value="tone.tone" :key="tone.id">
            {{ tone.tone }}
          </option>
        </select>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email" class="form-label">{{
          language == "hebrew"
            ? 'שלח לדוא"ל (לא חובה)'
            : "Send to Email (not mandatory)"
        }}</label>
        <input type="text" id="email" v-model="promptParams.email" />
      </div>

      <!-- Generate Button -->
      <div class="form-group">
        <button @click="generateContent" class="form-button">
          {{ language == "hebrew" ? "צור תוכן" : "Generate Content" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
  width: 64%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
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
