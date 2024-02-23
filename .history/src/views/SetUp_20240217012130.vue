<template>
  <div class="setup-class">
    <div v-if="step === 1">
      <h2>Step 1 - Let's Start</h2>
      <!-- <BasicDetails /> -->
      <button @click="nextStep">Next</button>
    </div>
    <div v-else-if="step === 2">
      <h2>Step 2 - Your Main Goal</h2>
      <main-goal :goals="goals" @select-goal="selectGoal" />
      <button @click="nextStep">Next</button>
    </div>
    <div v-else-if="step === 3">
      <h2>Step 3 - Set Your Preferences</h2>
      <label for="email">Email Address:</label>
      <input type="email" id="email" v-model="email" />
      <label for="language">Language:</label>
      <select id="language" v-model="language">
        <option value="hebrew">Hebrew</option>
        <option value="english">English</option>
      </select>
      <label for="tone">Tone:</label>
      <select id="tone" v-model="tone">
        <option value="professional">Professional/Business Tone</option>
        <option value="informal">Informal/Friendly Tone</option>
        <option value="persuasive">Persuasive/Marketing Tone</option>
        <option value="educational">Educational/Informative Tone</option>
        <option value="creative">Creative/Storytelling Tone</option>
      </select>
      <label for="useEmojis">Use Emojis in Content:</label>
      <input type="checkbox" id="useEmojis" v-model="useEmojis" />
      <label for="contentFormat">Content Format:</label>
      <select id="contentFormat" v-model="contentFormat">
        <option value="email">Email</option>
        <option value="blog">Blog (HTML)</option>
        <option value="api">API (JSON)</option>
        <option value="social">Social Network</option>
        <option value="sms">SMS</option>
        <option value="academic">Academic Assignment</option>
      </select>
      <p>
        Disclaimer: This option is only for the format and will not publish or
        send the content anywhere.
      </p>
      <label for="automaticSend">Automatic Send:</label>
      <input type="checkbox" id="automaticSend" v-model="automaticSend" />
      <div v-if="automaticSend">
        <template v-if="contentFormat === 'email'">
          <label for="sendToEmail">Send to Email:</label>
          <input type="email" id="sendToEmail" v-model="sendToEmail" />
        </template>
        <template v-else-if="contentFormat === 'api'">
          <label for="apiUrl">API URL:</label>
          <input type="text" id="apiUrl" v-model="apiUrl" />
          <label for="apiToken">API Token:</label>
          <input type="text" id="apiToken" v-model="apiToken" />
        </template>
        <template v-else-if="contentFormat === 'sms'">
          <label for="sendToPhone">Send to Phone Number:</label>
          <input type="text" id="sendToPhone" v-model="sendToPhone" />
        </template>
      </div>
      <button @click="finish">Finish</button>
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

export default {
  components: {
    // BasicDetails: () => import("../components/BasicDetails.vue"),
    MainGoal: () => import("../components/MainGoal.vue"),
  },
  data() {
    return {
      step: 2,
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
    selectGoal(goalId) {
      this.selectedGoal = goalId;
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
