<template>
  <div
    v-for="goal in goals"
    :key="goal.id"
    @click="selectGoal(goal.id)"
  >
    {{ goal }}
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: "MainGoal",
  emits: ["select-goal"],
  props: {
    selectedGoalId: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const newSelectedGoal = ref(null);
    const goals = localStorage.getItem("goalsList");

    const selectGoal = (goalId) => {
      console.log("emit(select-goal)");
      newSelectedGoal.value = goalId;
      emit("select-goal", goalId);
    };

    return {
      newSelectedGoal,
      goals,
      selectGoal,
    };
  },
};
</script>