<template>
  <div class="setup-class">
    <div v-if="step === 1">
      <h2>Step 1 - Let's Start</h2>
      <BasicDetails @set-basic-details="handleSetBasicDetails" />
    </div>
    <div v-else-if="step === 2">
      <h2>Step 2 - Your Main Goal</h2>
      <MainGoal :selectedGoalId="selectedGoal" @select-goal="selectGoal" />
    </div>
    <div v-else-if="step === 3">
      <h2>Step 3 - Set Your Preferences</h2>
    <SetPrefrences :prefrences="prefrencesHistory" @set-prefrences="setPrefrences"/>
    </div>
  </div>
</template>

<script>
import { db } from "../main.js";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

import BasicDetails from "../components/BasicDetails.vue";
import MainGoal from "../components/MainGoal.vue";
import SetPrefrences from "../components/SetPrefrences.vue";
export default {
  components: {
    BasicDetails,
    MainGoal,
    SetPrefrences,
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
      prefrencesHistory:{},
      countries: [
        { code: "us", name: "United States", prefix: "1" },
        { code: "gb", name: "United Kingdom", prefix: "44" },
        { code: "ca", name: "Canada", prefix: "1" },
        // Add more countries here
      ],
    };
  },
  methods: {
    nextStep() {
      this.step++;
    },
    handleSetBasicDetails(basicDetails) {
      this.firstName = basicDetails.firstName;
      this.lastName = basicDetails.lastName;
      this.companyName = basicDetails.companyName;
      this.phonePrefix = basicDetails.phonePrefix;
      this.phoneNumber = basicDetails.phoneNumber;
      this.email = basicDetails.email;
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
      this.nextStep();
    },
    async finish() {
      console.log("Finish");
      // Update document user from collection users with the parameters of the wizard
      const userToken = localStorage.getItem("userToken");
      const user = {
        firstName: this.firstName,
        lastName: this.lastName,
        companyName: this.companyName,
        phone: `+${this.phonePrefix}-${this.phoneNumber}`,
        goal: this.selectedGoal,
        email: this.email,
        language: this.language,
        tone: this.tone,
        useEmojis: this.useEmojis,
        contentFormat: this.contentFormat,
        automaticSend: this.automaticSend,
        sendToEmail: this.sendToEmail,
        apiUrl: this.apiUrl,
        apiToken: this.apiToken,
        sendToPhone: this.sendToPhone,
        userToken:userToken
      };
      console.log(user);
      // Get userToken from local storage

      // Get the users collection
      const usersCollection = collection(db, "users");

      // Find the document with the same userToken
      const q = await query(
        usersCollection,
        where("userToken", "==", userToken)
      );

      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            // If the document exists, update it
            const docRef = doc(db, "users", change.doc.id);
            updateDoc(docRef, user)
              .then(() => {
                localStorage.setItem("user", JSON.stringify(user));
                console.log("Document successfully updated!");
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
          }
        });
      });
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
  width: 60%;
}
</style>
