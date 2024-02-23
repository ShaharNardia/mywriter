<template>
  <div class="setup-class">
    <div class="breadcrumbs">
      <button v-if="step > 1" @click="goBack">Back</button>
      <span>{{ getBreadcrumbText(step) }}</span>
      <button v-if="step < 4" @click="goForward">Next</button>
    </div>
    <div v-if="step === 1" class="align-center">
      <div class="width22">
        <h1>Step 1 - Let's Start</h1>
        <BasicDetails
          @set-basic-details="handleSetBasicDetails"
        />
      </div>
    </div>
    <div v-else-if="step === 2" class="align-center">
      <div class="width62">
        <h1>Step 2 - Your Main Goal</h1>
        <MainGoal
          @select-goal="selectGoal"
        />
      </div>
    </div>
    <div v-else-if="step === 3" class="align-center">
      <div class="width62">
        <h1>Step 3 - Select tone</h1>
        <SelectTone
          @select-tone="selectTone"
        />
      </div>
    </div>

    <div v-else-if="step === 4" class="align-center">
      <div class="width62">
        <h1>Step 4 - Content format</h1>
        <SelectPlatform
          @select-platform="selectPlatform"
        />
      </div>
    </div>

    <div class="clarification">
        *** You will have the opportunity to modify the parameters during any content generating request.
    </div>
  </div>
</template>

<script>
import BasicDetails from "../components/BasicDetails.vue";
import MainGoal from "../components/MainGoal.vue";
import SelectTone from "../components/SelectTone.vue";
import SelectPlatform from "../components/SelectPlatform.vue";

import axios from "axios";

export default {
  components: {
    BasicDetails,
    MainGoal,
    SelectTone,
    SelectPlatform,
  },
  data() {
    return {
      step: 1,
      firstName: "",
      lastName: "",
      companyName: "",
      phonePrefix: "",
      phoneNumber: "",
      email: "",
      language: "hebrew",
      tone: "professional",
      useEmojis: false,
      contentFormat: "email",
      automaticSend: false,
      sendToEmail: "",
      apiUrl: "",
      apiToken: "",
      sendToPhone: "",
      selectedGoal: 0,
      sendUpdates: false,
      prefrencesHistory: {},
    };
  },
  mounted() {},
  methods: {
    goBack() {
      this.step--;
    },
    goForward() {
      this.step++;
    },
    getBreadcrumbText() {
      if (this.step === 1) {
        return "Step 1 - Basic Details";
      } else if (this.step === 2) {
        return "Step 2 - Your Main Goal";
      } else if (this.step === 3) {
        return "Step 3 - Set Your Preferences";
      } else if (this.step === 4) {
        return "Step 4 - Content format";
      } else {
        return "";
      }
    },
    // createUserObject() {
    //   return {
    //     user: {
    //       firstName: this.firstName,
    //       lastName: this.lastName,
    //       companyName: this.companyName,
    //       phone: this.phoneNumber,
    //       goal: this.selectedGoal,
    //       email: this.email,
    //       language: this.language,
    //       tone: this.tone,
    //       useEmojis: this.useEmojis,
    //       contentFormat: this.contentFormat,
    //       sendUpdates: this.sendUpdates,
    //       userToken: localStorage.getItem("userToken"),
    //     },
    //   };
    // },
    async updateUser(user) {
      //const userObject = this.createUserObject();
      localStorage.setItem("user", JSON.stringify(user));
      // console.log(userObject);
      user.userToken = localStorage.getItem("userToken");
      try {
        const response = await axios.post(
          "https://updateuser-ibnrirhwvq-uc.a.run.app",
          user
        );
        console.log("User updated successfully:", response.data);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
    finish() {
      this.$router.push({ name: "home-page" });
    },
    nextStep() {
      this.step++;
    },
    handleSetBasicDetails(user) {
      this.user = user;
      this.updateUser(user);
      this.nextStep();
    },
    selectTone(user) {
      this.updateUser(user);
      this.nextStep();
    },
    selectPlatform(user) {
      this.updateUser(user);
      this.finish();
    },
    selectGoal(user) {
      this.updateUser(user);
      this.nextStep();
    },
  },
};
</script>

<style>
.selected {
  border: 2px solid blue;
}
.setup-class {
  margin: 0 auto;
}
.clarification {
  position: absolute;
  top: 35%;
  left: 1%;
  margin: 0 auto;

  font-size: 1.5vh;
  line-height: 2vh;
  font-weight: bold;
  width: 16%;
  color: #666;
}
</style>
