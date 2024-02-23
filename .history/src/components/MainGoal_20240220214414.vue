<template>
  <div class="grid-page">
    <div class="squares-container">
      <div
        class="square"
        v-for="item in goals"
        :key="item.id"
        @click="selectGoal(item.goal)"
        :class="{ selected: item.goal === selectedGoal }" 
      >
        <font-awesome-icon
          :icon="item.icon"
          class="fa-2x"
          style="color: #007bff"
        />
        <h3>{{ item.goal }}</h3>
        <div>{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "MainGoal",
  emits: ["select-goal"],
  setup(_, { emit }) {
    // Assuming user data is stored under "user" key in local storage
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const goals = JSON.parse(localStorage.getItem("goalsList")) || [];

    // Initialize selectedGoal based on user.goal
    const selectedGoal = ref(user.goal || null);

    const selectGoal = (goalId) => {
      selectedGoal.value = goalId; // Update local selected goal
      user.goal = goalId; // Update user's goal
      localStorage.setItem("user", JSON.stringify(user)); // Save updated user to local storage
      emit("select-goal", user); // Emit event
    };

    // Watcher to handle external changes to selectedGoalId prop if needed
    watch(() => user.goal, (newVal) => {
      selectedGoal.value = newVal;
    });

    return {
      selectedGoal,
      goals,
      selectGoal,
    };
  },
};
</script>

<style scoped>
.square.selected {
  border: 0.5vh solid blue;
}
</style>