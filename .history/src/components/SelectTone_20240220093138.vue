<template>
    <h1>Select Tone</h1>
      <select v-model="tone" id="tone">
        <option v-for="tone in tones" :key="tone" :value="tone">{{ tone }}</option>
      </select>
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
