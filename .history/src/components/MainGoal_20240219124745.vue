<template>
  <div class="grid-page">
    <div class="squares-container">
      <div
        class="square"
        v-for="item in goals"
        :key="item.id"
        @click="selectGoal(item.goal)"
      >
        <font-awesome-icon
          :icon="item.icon"
          class="fa-2x"
          style="color: #007bff"
        />
        <h3>
          {{ item.goal }}
        </h3>
        <div>
          {{ item.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

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
