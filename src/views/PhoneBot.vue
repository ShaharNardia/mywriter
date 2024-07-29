<template>
  <div>
    <h1>{{ title }}</h1>
    <div>
      <label for="phone">Phone Number:</label>
      <input
        type="text"
        id="phone"
        v-model="phoneNumber"
        placeholder="05X-XXXXXXX"
      />
      <button @click="savePhoneNumber">Save</button>
    </div>
    <div>
      <h2>Phone Collection Records:</h2>
      <ul>
        <li v-for="record in phoneRecords" :key="record.id">
          {{ record.phoneNumber }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { collection, addDoc, getDocs } from "firebase/firestore"; // Import necessary Firestore functions
import { db } from "../main.js";

export default {
  data() {
    return {
      title: "Phone Page",
      phoneNumber: "",
      phoneRecords: [],
    };
  },
  methods: {
    async savePhoneNumber() {
      try {
        const docRef = await addDoc(collection(db, "phonebot"), {
          phoneNumber: this.phoneNumber,
        });
        this.sendRequest(docRef.id);
      } catch (error) {
        console.log(error);
      }
    },
    sendRequest(documentId) {
      const phoneNum = "972" + this.phoneNumber.slice(1).replace("-", "");
      const formData = new FormData();
      formData.append("phone", phoneNum);
      formData.append("caller_id", "972508908099");
      formData.append("scenario_id", "42613");
      formData.append("domain", "nardia");
      formData.append(
        "variables",
        `{"phone":"${this.phoneNumber}","docId":"${documentId}"}`
      );
      formData.append(
        "access_token",
        "4b46bc783b467e3fd06702a3747b25b43a9458f56eb73abe89d2fa190a51a48c"
      );

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://kitapi-eu.voximplant.com/api/v3/scenario/runScenario",
        data: formData,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchPhoneRecords() {
      try {
        const querySnapshot = await getDocs(collection(db, "phonebot"));
        this.phoneRecords = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.fetchPhoneRecords();
  },
};
</script>
