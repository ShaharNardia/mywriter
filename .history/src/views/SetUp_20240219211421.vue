<template>
  <div class="setup-class">
    <div v-if="step === 1" class="align-center">
      <div class="width22">
        <h1>Step 1 - Let's Start</h1>
        <BasicDetails
          :userSavedDetails="userSavedDetails"
          @set-basic-details="handleSetBasicDetails"
        />
      </div>
    </div>
    <div v-else-if="step === 2" class="align-center">
      <div class="width62">
        <h1>Step 2 - Your Main Goal</h1>
        <MainGoal
          :selectedGoalId="userSavedDetails?.goal"
          @select-goal="selectGoal"
        />
      </div>
    </div>
    <div v-else-if="step === 3" class="align-center">
      <div class="width22">

      <h1>Step 3 - Set Your Preferences</h1>
      <SetPrefrences
        :userSavedDetails="userSavedDetails"
        @set-prefrences="setPrefrences"
      />
    </div>
    </div>

    <div v-else-if="step === 4" class="align-center">
      <div class="width22">

      <h1>Step 4 - Content format</h1>
      <SelectPlatform
        :userSavedDetails="userSavedDetails"
        @set-prefrences="setPrefrences"
      />
    </div>
    </div>

  </div>
</template>

<script>
import SelectPlatform from "@/components/SelectPlatform.vue";
import BasicDetails from "../components/BasicDetails.vue";
import MainGoal from "../components/MainGoal.vue";
import SetPrefrences from "../components/SetPrefrences.vue";

import axios from "axios";

export default {
  components: {
    BasicDetails,
    MainGoal,
    SetPrefrences,
    ContentFormat
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
    createUserObject() {
      return {
        user: {
          firstName: this.firstName,
          lastName: this.lastName,
          companyName: this.companyName,
          phone: this.phoneNumber,
          goal: this.selectedGoal,
          email: this.email,
          language: this.language,
          tone: this.tone,
          useEmojis: this.useEmojis,
          contentFormat: this.contentFormat,
          sendUpdates: this.sendUpdates,
          userToken: localStorage.getItem("userToken"),
        },
      };
    },
    async updateUser() {
      const userObject = this.createUserObject();
      console.log(userObject);
      try {
        const response = await axios.post(
          "https://updateuser-ibnrirhwvq-uc.a.run.app",
          userObject
        );
        console.log("User updated successfully:", response.data);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
    finish() {
      this.updateUser();
      console.log("Finish");
      this.$router.push({ name: "home-page" });
    },
    nextStep() {
      this.step++;
    },
    handleSetBasicDetails(basicDetails) {
      this.firstName = basicDetails.firstName;
      this.lastName = basicDetails.lastName;
      this.companyName = basicDetails.companyName;
      this.phoneNumber = basicDetails.phoneNumber;
      this.email = basicDetails.email;
      this.sendUpdates =
        basicDetails.sendUpdates !== undefined
          ? basicDetails.sendUpdates
          : this.sendUpdates;
      this.updateUser();
      this.nextStep();
    },
    setPrefrences(prefrences) {
      this.language = prefrences.language;
      this.tone = prefrences.tone;
      this.useEmojis = prefrences.useEmojis;
      this.contentFormat = prefrences.contentFormat;
      this.automaticSend = prefrences.automaticSend;
      this.sendToEmail = prefrences.sendToEmail;
      this.apiUrl = prefrences.apiUrl;
      this.apiToken = prefrences.apiToken;
      this.sendToPhone = prefrences.sendToPhone;
      this.finish();
    },
    selectGoal(goalId) {
      this.selectedGoal = goalId;
      this.updateUser();
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
</style>
