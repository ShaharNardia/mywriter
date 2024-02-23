<template>
  <div class="grid-page">
    <div class="squares-container">
      <div class="square" v-for="index in 9" :key="index" @click="redirectToRoute(index)"></div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    redirectToRoute(index) {
      // Redirect to other route based on the clicked square
      // Replace `routeName` with the actual route name you want to redirect to
      this.$router.push({ name: `routeName${index}` });
    },
  },
};
</script>

<style>

</style>
