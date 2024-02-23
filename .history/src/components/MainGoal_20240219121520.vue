<template>
  <div
    v-for="item in goals"
    :key="item.id"
    @click="selectGoal(item.id)"
  >
    {{ item.goal }}
    {{ item.icon }}
    {{ item.description }}
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
    const goals = JSON.parse(localStorage.getItem("goalsList"));

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