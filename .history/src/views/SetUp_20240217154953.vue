<template>
  <div class="setup-class">
    <div v-if="step === 1">
      <h2>Step 1 - Let's Start</h2>
      <BasicDetails
        :userSavedDetails="userSavedDetails"
        @set-basic-details="handleSetBasicDetails"
      />
    </div>
    <div v-else-if="step === 2">
      <h2>Step 2 - Your Main Goal</h2>
      <MainGoal
        :selectedGoalId="userSavedDetails?.goal"
        @select-goal="selectGoal"
      />
    </div>
    <div v-else-if="step === 3">
      <h2>Step 3 - Set Your Preferences</h2>
      <SetPrefrences
        :userSavedDetails="userSavedDetails"
        @set-prefrences="setPrefrences"
      />
    </div>
  </div>
</template>

<script>
import { db } from "../main.js";
import { collection, query, where,  updateDoc } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
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
      sendUpdates: false,
      prefrencesHistory: {},
    };
  },
  mounted() {
    this.setupSnapshotListener();
  },
  methods: {
    async setupSnapshotListener() {
      const userToken = localStorage.getItem("userToken");
      const usersCollection = collection(db, "users");
      let user = JSON.stringify(this.createUserObject());
      // Find the document with the same userToken
      const q = await query(
        usersCollection,
        where("userToken", "==", userToken)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        const docRef = doc(db, "users", doc.id);
        updateDoc(docRef, user)
          .then(() => {
            localStorage.setItem("user", JSON.stringify(user));
            console.log("Document successfully updated!");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      });
    },
    createUserObject() {
      return {
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
      };
    },
    async updateUser() {
      // Update document user from collection users with the parameters of the wizard
      const user = this.createUserObject();
      console.log(user);

      const usersCollection = collection(db, "users");

      // Find the document with the same userToken
      const q = await query(
        usersCollection,
        where("userToken", "==", user.userToken)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        const docRef = doc(db, "users", doc.id);
        updateDoc(docRef, user)
          .then(() => {
            localStorage.setItem("user", JSON.stringify(user));
            console.log("Document successfully updated!");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      });
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
  width: 22%;
}
</style>
