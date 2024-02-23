<script>
import { VueTelInput } from 'vue-tel-input';
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