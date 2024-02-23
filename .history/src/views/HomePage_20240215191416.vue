<template>
  <div class="home-page">
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
.home-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.squares-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.square {
  width: 100px;
  height: 100px;
  background-color: #ccc;
}
</style>
