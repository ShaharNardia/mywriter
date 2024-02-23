<template>
  <div class="flexed">
    <div>
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="firstName" />
    </div>
    <div class="marg-l-2">
      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="lastName" />
    </div>
  </div>
  <div class="flexed">
    <div class="div-88">
      <label for="companyName">Company Name:</label>
      <input class="input-100" type="text" id="companyName" v-model="companyName" />
    </div>
  </div>
  <div class="flexed">
    <div>
      <label for="email">Email address:</label>
      <input type="text" id="email" v-model="email" />
    </div>
    <div class="marg-l-2">
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
  <div class="flexed">
    <input type="checkbox" id="sendUpdates" v-model="sendUpdates" />
      <label for="sendUpdates">Send me updates:</label>
  </div>
  <div class="aligned-center">
    <button @click="setBasicDetails">Set Basic Details</button>
  </div>
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
      this.phoneNumber = value;
      console.log(this.phoneNumber);
    },
    setBasicDetails() {
      this.$emit("set-basic-details", {
        firstName: this.firstName,
        lastName: this.lastName,
        companyName: this.companyName,
        phone: this.phoneNumber,
        email: this.email,
      });
    },
  },
};
</script>
