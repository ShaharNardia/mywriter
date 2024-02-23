<template>
  <div class="width62">
    <h1>Register WordPress Website</h1>
    <form @submit.prevent="registerSite">
      <label for="wordpressUrl">WordPress URL:</label>
      <input type="text" id="wordpressUrl" v-model="wordpressUrl" required>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      wordpressUrl: '',
    };
  },
  methods: {
    async registerSite() {
      try {
        const userToken = localStorage.getItem('userToken');
        const token = 'your_token_here'; // Replace with your token

        // Validate WordPress URL
        if (!this.isValidUrl(this.wordpressUrl)) {
          alert('Please enter a valid WordPress URL');
          return;
        }

        const response = await axios.post('/api/registerWpUserSite', {
          userToken,
          wordpressUrl: this.wordpressUrl,
          token,
        });

        alert(response.data.message);
        // Redirect to homepage
        this.$router.push('/');
      } catch (error) {
        console.error('Error registering user site:', error);
        alert('Failed to register user site');
      }
    },
    isValidUrl(url) {
      // Implement your URL validation logic here
      // For example, you can use a regular expression
      const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
      return urlRegex.test(url);
    },
  },
};
</script>
