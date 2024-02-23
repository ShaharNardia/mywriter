<template>
  <div class="grid-page">
    <div class="squares-container">
      <div
        class="square"
        v-for="item in Platforms"
        :key="item.id"
        @click="selectPlatform(item.platform)"
        :class="{ 'selected': item.platform === selectedPlatform.value }"
      >
        <font-awesome-icon
          :icon="item.icon"
          class="fa-2x"
          style="color: #007bff"
          :class="{ 'selected-icon': item.platform === selectedPlatform.value }"
        />
        <h3>{{ item.platform }}</h3>
        <div>{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "SelectPlatform",
  emits: ["select-platform"],
  setup(_, { emit }) {
    // Attempt to retrieve the user object from local storage
    const user = JSON.parse(localStorage.getItem("user")) || {};

    // Use the platform from the user object or default to null
    const selectedPlatform = ref(user.platform || null);

    // Assuming your platforms list is stored correctly in local storage
    const Platforms = JSON.parse(localStorage.getItem("platformsList")) || [];

    // Function to select a platform and update the user object in local storage
    const selectPlatform = (platform) => {
      selectedPlatform.value = platform; // Update the selected platform
      user.platform = platform; // Update the user object
      localStorage.setItem("user", JSON.stringify(user)); // Save the updated user object to local storage
      emit("select-platform", platform); // Optionally emit an event with the selected platform
    };

    // Watch for external changes to selectedPlatform (if needed)
    watch(() => selectedPlatform.value, (newValue) => {
  console.log("New selected platform is:", newValue);
  // Any other logic that might use newValue
});

    return {
      selectedPlatform,
      Platforms,
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