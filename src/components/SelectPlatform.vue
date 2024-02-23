<template>
  <div class="grid-page">
    <div class="squares-container">
      <div
        class="square"
        v-for="item in platforms"
        :key="item.id"
        @click="selectPlatform(item.platform)"
        :class="{ selected: item.platform === selectedPlatform }"
      >
        <font-awesome-icon
          :icon="item.icon"
          class="fa-2x"
          style="color: #007bff"
        />
        <h3>
          {{ item.platform }}
        </h3>
        <div>
          {{ item.description }}
        </div>
      </div>
    </div>
  </div>
</template>
<!-- <button @click="selectPlatform">Set Basic Details</button> -->

<script>
import { ref, watch } from "vue";

export default {
  name: "SelectPlatform",
  emits: ["select-platform"],
  // data() {
  //   return {
  //     platform: "",
  //     : JSON.parse(localStorage.getItem("platformsList")) || [],
  //   };
  // },
  // methods: {
  //   selectPlatform() {
  //     this.$emit("select-platform", { user });
  //   },
  // },
  setup(_, { emit }) {
    // Assuming user data is stored under "user" key in local storage
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const platforms = JSON.parse(localStorage.getItem("platformsList")) || [];

    // Initialize selectedGoal based on user.goal
    const selectedPlatform = ref(user.platform || null);

    const selectPlatform = (platform) => {
      selectedPlatform.value = platform; // Update local selected goal
      user.platform = platform; // Update user's goal
      localStorage.setItem("user", JSON.stringify(user)); // Save updated user to local storage
      emit("select-platform", user); // Emit event
    };

    // Watcher to handle external changes to selectedGoalId prop if needed
    watch(() => user.goal, (newVal) => {
      selectedPlatform.value = newVal;
    });

    return {
      selectedPlatform,
      platforms,
      selectPlatform,
    };
  },
};
</script>
<style scoped>
.square.selected {
  border: 0.4vh solid blue;
}
</style>
