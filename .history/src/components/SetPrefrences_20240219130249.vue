<template>
  <div>
    <label for="email">Email Address:</label>
    <input type="email" id="email" v-model="email" />
  </div>
  <div>
    <label for="language">Language:</label>
    <select id="language" v-model="language">
      <option value="hebrew">Hebrew</option>
      <option value="english">English</option>
    </select>
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
  <label for="contentFormat">Content Format:</label>
  <select id="contentFormat" v-model="contentFormat">
    <option value="email">Email</option>
    <option value="blog">Blog (HTML)</option>
    <option value="api">API (JSON)</option>
    <option value="social">Social Network</option>
    <option value="sms">SMS</option>
    <option value="academic">Academic Assignment</option>
  </select>
  <p>
    Disclaimer: This option is only for the format and will not publish or
    send the content anywhere.
  </p>
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
  <button @click="setPrefrences">Set Basic Details</button>

</template>

<script>
export default {
  name: "SetPrefrences",
  emits: ['set-prefrences'],
  props: {
    userSavedDetails: Object,
  },
  data() {
    return {
      email: "",
      language: "",
      tone: "",
      useEmojis: false,
      contentFormat: "",
      automaticSend: false,
      sendToEmail: "",
      apiUrl: "",
      apiToken: "",
      sendToPhone: "",
      tones: localStorage.getItem("tonesList") 
    };
  },
  methods: {
    setPrefrences() {
      this.$emit("set-prefrences", {
        email: this.email,
        language: this.language,
        tone: this.tone,
        useEmojis: this.useEmojis,
        contentFormat: this.contentFormat,
        automaticSend: this.automaticSend,
        sendToEmail: this.sendToEmail,
        apiUrl: this.apiUrl,
        apiToken: this.apiToken,
        sendToPhone: this.sendToPhone,
      });
    },
  },
};
</script>
