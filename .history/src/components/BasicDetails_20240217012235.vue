<template>
  <div>
    <div>
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="firstName" />
    </div>
    <div>
      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="lastName" />
    </div>
  </div>
  <label for="companyName">Company Name:</label>
  <input type="text" id="companyName" v-model="companyName" />

  <label for="email">Email address:</label>
  <input type="text" id="email" v-model="email" />

  <label for="phonePrefix">Phone Number:</label>
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
</template>

<script>
export default {
  name: "BasicDetails",

  data() {
    return {
      firstName: "",
      lastName: "",
      companyName: "",
      phonePrefix: "",
      phoneNumber: "",
      countries: [
        { code: "US", name: "United States", prefix: "1" },
        { code: "CA", name: "Canada", prefix: "1" },
        { code: "GB", name: "United Kingdom", prefix: "44" },
        // Add more countries as needed
      ],
    };
  },
};
</script>
