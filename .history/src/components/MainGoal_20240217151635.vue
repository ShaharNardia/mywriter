<template>
  <div
    v-for="goal in goals"
    :key="goal.id"
    @click="selectGoal(goal.id)"
  >
    {{ goal.name }}
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
    const goals = ref([
      { id: 1, name: "Goal 1" },
      { id: 2, name: "Goal 2" },
      { id: 3, name: "Goal 3" },
      { id: 4, name: "Goal 4" },
      { id: 5, name: "Goal 5" },
      { id: 6, name: "Goal 6" },
    ]);

    const selectGoal = (goalId) => {
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