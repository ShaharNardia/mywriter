<template>
  <div class="flexed">
    <div>
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="firstName" />
    </div>
    <div>
      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="lastName" />
    </div>
  </div>
  <div>

    <label for="companyName">Company Name:</label>
    <input type="text" id="companyName" v-model="companyName" />
  </div>

  <div class="flexed">
    <div>
      <label for="email">Email address:</label>
      <input type="text" id="email" v-model="email" />
    </div>
    <div>
      <label for="phonePrefix">Phone Number:</label>
      <div class="flexed">
      <select id="phonePrefix" v-model="phonePrefix">
        <option
          v-for="country in countries"
          :key="country.code"
          :value="country.prefix"
        >
          {{ country.name }} (+{{ country.prefix }})
        </option>
      </select>
      <input type="text" id="phoneNumber" v-model="phoneNumber" />
    </div>
    </div>
  </div>
  <button @click="setBasicDetails">Set Basic Details</button>
</template>

<script>
export default {
  name: "BasicDetails",
  emits: ["set-basic-details"], // Corrected event name
  data() {
    return {
      firstName: "",
      lastName: "",
      companyName: "",
      phonePrefix: "",
      phoneNumber: "",
      email: "",
      countries: [
        { code: "US", name: "United States", prefix: "1" },
        { code: "CA", name: "Canada", prefix: "1" },
        { code: "GB", name: "United Kingdom", prefix: "44" },
        // Add more countries as needed
      ],
    };
  },
  methods: {
    setBasicDetails() {
      this.$emit("set-basic-details", {
        firstName: this.firstName,
        lastName: this.lastName,
        companyName: this.companyName,
        phone: `+${this.phonePrefix}${this.phoneNumber}`,
        email: this.email,
      });
    },
  },
};
</script>
