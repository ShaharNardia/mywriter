<template>
    {{options}}
    <div class="custom-dropdown">
      <div class="selected-option" @click="toggleDropdown">
        {{ selectedLabel }}
        <i class="arrow-icon" :class="{'arrow-up': isDropdownOpen, 'arrow-down': !isDropdownOpen}"></i>
      </div>
      <ul v-show="isDropdownOpen" class="dropdown-options">
        <li v-for="option in options" :key="option.value||option.goal " @click="selectOption(option)">
          <span v-if="option.icon" class="option-icon">
            <i :class="option.icon"></i>
          </span>
          {{ option.label }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      modelValue: {
        type: [String, Number],
        default: ''
      },
      options: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        isDropdownOpen: false,
      };
    },
    computed: {
      selectedLabel() {
        const selected = this.options.find(option => option.value === this.modelValue);
        return selected ? selected.label : 'Select an option';
      }
    },
    methods: {
      toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
      },
      selectOption(option) {
        this.$emit('update:modelValue', option.value);
        this.isDropdownOpen = false;
      },
    },
  };
  </script>
<style scoped>
.custom-dropdown {
  position: relative;
  display: inline-block;
}

.selected-option {
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.arrow-icon {
  margin-left: 5px;
}

.arrow-up {
  transform: rotate(180deg);
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 5px;
  padding: 0;
  list-style: none;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  display: none;
}

.dropdown-options li {
  padding: 10px;
  cursor: pointer;
}

.option-icon {
  margin-right: 5px;
}
</style>
