<template>
  <div class="grid-page">
    <div class="squares-container">
      <div
        class="square"
        v-for="item in tones"
        :key="item.id"
        @click="selectTone(item.tone)"
        :class="{ selected: item.tone === selectedTone }"
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
import { ref, watch } from "vue";

export default {
  name: "SelectTone",
  emits: ["select-tone"],
  // data() {
  //   return {
  //     tone: "",
  //     : JSON.parse(localStorage.getItem("tonesList")) || [],
  //   };
  // },
  // methods: {
  //   selectTone() {
  //     this.$emit("select-tone", { user });
  //   },
  // },
  setup(_, { emit }) {
    // Assuming user data is stored under "user" key in local storage
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const tones = JSON.parse(localStorage.getItem("tonesList")) || [];

    // Initialize selectedGoal based on user.goal
    const selectedTone = ref(user.tone || null);

    const selectTone = (tone) => {
      selectedTone.value = tone; // Update local selected goal
      user.tone = tone; // Update user's goal
      localStorage.setItem("user", JSON.stringify(user)); // Save updated user to local storage
      emit("select-tone", user); // Emit event
    };

    // Watcher to handle external changes to selectedGoalId prop if needed
    watch(() => user.goal, (newVal) => {
      selectedTone.value = newVal;
    });

    return {
      selectedTone,
      tones,
      selectTone,
    };
  },
};
</script>
<style scoped>
.square.selected {
  border: 0.4vh solid blue;
}
</style>
