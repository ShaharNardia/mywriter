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
  <div class="flexed">
    <div>
      <label for="companyName">Company Name:</label>
      <input type="text" id="companyName" v-model="companyName" />
    </div>
  </div>
  <div class="flexed">
    <div>
      <label for="email">Email address:</label>
      <input type="text" id="email" v-model="email" />
    </div>
    <div >
      <label for="phonePrefix">Phone Number:</label>
      <vue-tel-input
        class="input"
        v-model="phoneNumber"
        @input="updatePhone"
        :enabledCountryCode="true"
        :defaultCountry="defaultCountry"
      ></vue-tel-input>
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
      defaultCountry: "IL", // Set your default country code
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
    updatePhone(value) {
      this.phone = value;
      // You can emit this value to the parent component or use it as needed
      console.log(this.phone);
    },
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
