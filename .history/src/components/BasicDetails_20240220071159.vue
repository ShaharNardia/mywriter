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
        @country-changed="handleCountryChanged"
        :enabled-country-code="true"
        :default-country="defaultCountry"
      ></vue-tel-input>
    </div>
  </div>
  <div class="flexed">
    <div>
      <input type="checkbox" id="sendUpdates" v-model="useEmojis" />
    </div>
    <div>
      <label for="sendUpdates" class="disclaimer"
        >Use emojis in your generated content</label
      >
    </div>
  </div>



  <div>
    <label for="language">Language:</label>
    <div class="flexed">
<div class="width100">

  <select id="language" v-model="language">
    <option value="hebrew">Hebrew</option>
    <option value="english">English</option>
  </select>
</div>
<div>
  **
</div>
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
import { VueTelInput } from 'vue-tel-input';
import { ref, onMounted } from 'vue';

export default {
  name: "BasicDetails",
  components: {
    VueTelInput,
  },
  setup(_, { emit }) {
    const firstName = ref("");
    const lastName = ref("");
    const companyName = ref("");
    const sendUpdates = ref(false);
    const email = ref("");
    const dialCode = ref("");
    const phoneNumber = ref('');
    const defaultCountry = ref('IL');
    const useEmojis = ref(false);

    const handleCountryChanged = (country) => {
      console.log('Country changed: ', country.dialCode);
      dialCode.value = country.dialCode;
    };

    onMounted(() => {
      console.log('BasicDetails component mounted');
    });

    const updatePhone = (phoneNumberEvent) => {
      console.log(phoneNumberEvent.target.value);
      phoneNumber.value = phoneNumberEvent.target.value;
    };

    const setBasicDetails = () => {
      emit("set-basic-details", {
        firstName: firstName.value,
        lastName: lastName.value,
        companyName: companyName.value,
        phoneNumber: `+${dialCode.value}-${phoneNumber.value}`,
        email: email.value,
        sendUpdates: sendUpdates.value,
      });
    };

    return {
      firstName,
      lastName,
      companyName,
      sendUpdates,
      email,
      dialCode,
      phoneNumber,
      defaultCountry,
      useEmojis,
      handleCountryChanged,
      updatePhone,
      setBasicDetails,
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
