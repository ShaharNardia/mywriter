<template>
  <div class="grid-page">
    <div class="squares-container">
      <div
        class="square"
        v-for="item in Platforms"
        :key="item.id"
        @click="selectPlatform(item.platform)"
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
<!-- Disclaimer: This option is only for the format and will not publish or
send the content anywhere. -->
<script>
import { ref } from "vue";

export default {
  name: "MainPlatform",
  emits: ["select-platform"],
  props: {
    selectedPlatformId: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const newSelectedPlatform = ref(null);
    const Platforms = JSON.parse(localStorage.getItem("platformsList"));

    const selectPlatform = (platformId) => {
      console.log("emit(select-platform)");
      newSelectedPlatform.value = platformId;
      emit("select-platform", platformId);
    };

    return {
      newSelectedPlatform,
      Platforms,
      selectPlatform,
    };
  },
};
</script>
