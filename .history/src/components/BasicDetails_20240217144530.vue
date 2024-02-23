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
      <input
        class="input-100"
        type="text"
        id="companyName"
        v-model="companyName"
      />
    </div>
  </div>
  <div class="flexed">
    <div>
      <label for="email">Email address:</label>
      <input type="text" id="email" v-model="email" />
    </div>
    <div class="marg-l-2">
      <label for="phoneNumber">Phone Number:</label>
      <vue-tel-input
        class="input"
        v-model="phoneNumber"
        @input="updatePhone"
        :enabledCountryCode="true"
        :defaultCountry="defaultCountry"
        v-model:country="country"
      ></vue-tel-input>
    </div>
  </div>
  <div class="flexed">
    <div>
      <input type="checkbox" id="sendUpdates" v-model="sendUpdates" />
    </div>
    <div>
      <label for="sendUpdates" class="disclaimer"
        >Send me updates and notifications to my email address.</label
      >
    </div>
  </div>
  <div class="aligned-center">
    <button @click="setBasicDetails">Set Basic Details</button>
  </div>
</template>

<script>
export default {
  name: "BasicDetails",
  emits: ["set-basic-details"], // Corrected event name
  watch: {
    country(newCountry) {
      if (newCountry) {
        this.dialCode = newCountry.dialCode; // Update the dial code when the country changes
      }
    },
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      companyName: "",
      phoneNumber: "",
      sendUpdates: false,
      defaultCountry: "IL", // Set your default country code
      email: "",
      dialCode: "", // Add this to store the dial code
      country: null, // Add this to store the country object
    };
  },
  mounted() {
    this.dialCode = "972"; // Replace with the dial code for your default country
  },
  methods: {
    updatePhone(phoneNumber) {
      console.log(phoneNumber.target.value);
      this.phoneNumber = phoneNumber.target.value; // Include the dial code
    },
    updateCountry(countryObject) {
      console.log(countryObject);
      if (countryObject.iso2 === this.defaultCountry.toLowerCase()) {
        this.dialCode = countryObject.dialCode; // Update the dial code when the country changes
      }
    },
    setBasicDetails() {
      this.$emit("set-basic-details", {
        firstName: this.firstName,
        lastName: this.lastName,
        companyName: this.companyName,
        phoneNumber: this.phoneNumber,
        email: this.email,
        sendUpdates: this.sendUpdates,
      });
    },
  },
};
</script>
