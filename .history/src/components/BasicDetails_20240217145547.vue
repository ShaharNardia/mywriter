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
import { VueTelInput } from 'vue-tel-input-vuetify';
import { ref, onMounted,  emit } from 'vue';

export default {
  name: "BasicDetails",
  components: {
    VueTelInput,
  },
  setup() {
    const firstName = ref("");
    const lastName = ref("");
    const companyName = ref("");
    const sendUpdates = ref(false);
    const email = ref("");
    const dialCode = ref("");
    const phoneNumber = ref('');
    const defaultCountry = ref('IL');

    const handleCountryChanged = (country) => {
      console.log('Country changed: ', country.dialCode);
      dialCode.value = country.dialCode;
    };

    onMounted(() => {
      const defaultCountryObject = VueTelInput.methods.getCountry(defaultCountry.value);
      console.log('Default country dial code: ', defaultCountryObject.dialCode);
      dialCode.value = defaultCountryObject.dialCode;
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
        phoneNumber: phoneNumber.value,
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
      handleCountryChanged,
      updatePhone,
      setBasicDetails,
    };
  },
};
</script>
