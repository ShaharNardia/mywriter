<template>
  <div class="flexed">
    <div>
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="user.firstName" />
    </div>
    <div class="marg-l-2">
      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="user.lastName" />
    </div>
  </div>
  <div class="flexed">
    <div class="div-88">
      <label for="companyName">Company Name:</label>
      <input
        class="input-100"
        type="text"
        id="companyName"
        v-model="user.companyName"
      />
    </div>
  </div>
  <div class="flexed">
    <div>
      <label for="email">Email address:</label>
      <input type="text" id="email" v-model="user.email" />
    </div>
    <div class="marg-l-2">
      <label for="phoneNumber">Phone Number:</label>
      <vue-tel-input
        class="input"
        v-model="user.phoneNumber"
        @country-changed="handleCountryChanged"
        :enabled-country-code="true"
        :default-country="defaultCountry"
      ></vue-tel-input>
    </div>
  </div>
  <div class="flexed">
    <div>
      <input type="checkbox" id="sendUpdates" v-model="user.useEmojis" />
    </div>
    <div>
      <label for="sendUpdates" class="disclaimer"
        >Use emojis in your generated content 😊</label
      >
    </div>
  </div>

  <div>
    <label for="language">Language:</label>
    <div style="display: flex; align-items: baseline">
      <select id="language" v-model="user.language">
        <option value="hebrew">Hebrew</option>
        <option value="english">English</option>
      </select>
      <span
        style="margin-left: 2%; font-size: 1.2vh; width: 50%; font-weight: bold"
        >* The language you would like to generate content</span
      >
    </div>
  </div>

  <div class="flexed">
    <div>
      <input type="checkbox" id="sendUpdates" v-model="user.sendUpdates" />
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
import { VueTelInput } from "vue-tel-input";
import { ref, reactive, onMounted } from "vue";

export default {
  name: "BasicDetails",
  components: {
    VueTelInput,
  },
  setup(_, { emit }) {
    const user = reactive(JSON.parse(localStorage.getItem("user")) || {
      firstName: '',
      lastName: '',
      companyName: '',
      sendUpdates: false,
      email: '',
      dialCode: '',
      phoneNumber: '',
      language: 'hebrew',
      useEmojis: false,
    });

    const defaultCountry = ref("IL");

    const handleCountryChanged = (country) => {
      user.dialCode = country.dialCode;
    };

    onMounted(() => {
    });

    const updatePhone = (phoneNumberEvent) => {
      user.phoneNumber.value = phoneNumberEvent.target.value;
    };

    const setBasicDetails = () => {
      localStorage.setItem("user", JSON.stringify(user)); // Save to localStorage
      emit("set-basic-details", user); // Emit an event with the user data
    };

    return {
      user,
      defaultCountry,
      handleCountryChanged,
      setBasicDetails,
      updatePhone
    };
  },
};
</script>
<style scoped>
#language {
  width: 44%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
