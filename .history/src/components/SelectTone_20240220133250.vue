<template>
  <div class="grid-page">
    <div class="squares-container">
      <div
        class="square"
        v-for="item in tones"
        :key="item.id"
        @click="selectTone(item.tone)"
        :class="{ selected: item.tone === tone }"
      >
        <font-awesome-icon
          :icon="item.icon"
          class="fa-2x"
          style="color: #007bff"
        />
        <h3>
          {{ item.tone }}
        </h3>
        <div>
          {{ item.description }}
        </div>
      </div>
    </div>
  </div>
</template>
<!-- <button @click="selectTone">Set Basic Details</button> -->

<script>
export default {
  name: "SelectTone",
  emits: ["select-tone"],
  data() {
    return {
      tone: "",
      tones: JSON.parse(localStorage.getItem("tonesList")) || [],
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
<style scoped>
.square.selected {
  border-color: red;
}
</style>