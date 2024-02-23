<template>
  <div>
    <label for="email">Email Address:</label>
    <input type="email" id="email" v-model="email" />
  </div>
 
  <div>
    <label for="tone">Tone:</label>
    <select id="tone" v-model="tone">
    <option v-for="option in tones" :value="option.tone" :key="option.id">
      {{ option.tone }}
    </option>
  </select>
  </div>
  <label for="useEmojis">Use Emojis in Content:</label>
  <input type="checkbox" id="useEmojis" v-model="useEmojis" />
  <label for="automaticSend">Automatic Send:</label>
  <input type="checkbox" id="automaticSend" v-model="automaticSend" />
  <div v-if="automaticSend">
    <template v-if="contentFormat === 'email'">
      <label for="sendToEmail">Send to Email:</label>
      <input type="email" id="sendToEmail" v-model="sendToEmail" />
    </template>
    <template v-else-if="contentFormat === 'api'">
      <label for="apiUrl">API URL:</label>
      <input type="text" id="apiUrl" v-model="apiUrl" />
      <label for="apiToken">API Token:</label>
      <input type="text" id="apiToken" v-model="apiToken" />
    </template>
    <template v-else-if="contentFormat === 'sms'">
      <label for="sendToPhone">Send to Phone Number:</label>
      <input type="text" id="sendToPhone" v-model="sendToPhone" />
    </template>
  </div>
  <button @click="selectTone">Set Basic Details</button>

</template>

<script>
export default {
  name: "SelectTone",
  emits: ['select-tone'],
  props: {
    userSavedDetails: Object,
  },
  data() {
    return {
      tone: "",
      tones: JSON.parse(localStorage.getItem("tonesList")) || []
    };
  },
  methods: {
    selectTone() {
      this.$emit("select-tone", {
        tone: this.tone,
      });
    },
  },
};
</script>
