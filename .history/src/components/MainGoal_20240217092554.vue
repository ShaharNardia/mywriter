<template>
<div
        v-for="goal in goals"
        :key="goal.id"
        @click="selectGoal(goal.id)"
        :class="{ selected: selectedGoal === goal.id }"
      >
        {{ goal.name }}
      </div>
</template>

<script>
export default {
  name: "MainGoal",

  data() {
    return {
      selectedGoal: null,
      goals: [
        { id: 1, name: "Goal 1" },
        { id: 2, name: "Goal 2" },
        { id: 3, name: "Goal 3" },
        { id: 4, name: "Goal 4" },
        { id: 5, name: "Goal 5" },
        { id: 6, name: "Goal 6" },
      ],
    };
  },
  methods: {
    selectGoal(goalId) {
      this.selectedGoal = goalId;
      this.$emit("select-goal", goalId);
    },
  },
};
</script>
