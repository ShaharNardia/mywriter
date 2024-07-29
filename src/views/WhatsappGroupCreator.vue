<template>
  <div>
    <div style="display: flex">
      <div>
        <h3>Upload Phone Numbers</h3>
        <input
          type="file"
          ref="fileInput"
          @change="uploadFile"
          accept=".xlsx, .csv"
        />
        <div v-if="phoneRecords">
          <h3>Phone Records ({{ phoneRecords.length }})</h3>
          <div v-for="phoneRecord in phoneRecords" :key="phoneRecord.id">
            {{ phoneRecord.contactPhoneNumber }}<br /><br />
          </div>
        </div>
      </div>

      <div>
        <h3>GreenAPI Settings</h3>
        <div><input v-model="newSetting.host" placeholder="Host" /></div>
        <div>
          <input v-model="newSetting.idInstance" placeholder="Instance ID" />
        </div>
        <div>
          <input
            v-model="newSetting.apiTokenInstance"
            placeholder="API Token"
          />
        </div>
        <div>
          <button class="small-btn" @click="addGreenApiSetting">Add GreenAPI Setting</button>
        </div>
      </div>

      <div style="margin:0 50px">
        <button style="margin-top: 0" class="small-btn" @click="fetchContacts">Fetch Groups</button>
        <h3 style="margin-top: 0px;">Groups ({{ groups.length }})</h3>
        <ul>
          <li v-for="group in groups" :key="group.id">
            {{ group.name }}
            <button class="small-btn" @click="fetchGroupData(group.id)">
              Get Group Data
            </button>
          </li>
        </ul>
      </div>

      <div v-if="groupData">
        <h3>Group Data</h3>
        <p><strong>Group ID:</strong> {{ groupData.groupId }}</p>
        <p><strong>Owner:</strong> {{ groupData.owner }}</p>
        <p><strong>Subject:</strong> {{ groupData.subject }}</p>
        <p><strong>Creation:</strong> {{ groupData.creation }}</p>
        <h4>Participants:</h4>
        <ul>
          <li
            v-for="participant in groupData.participants"
            :key="participant.id"
          >
            <p><strong>ID:</strong> {{ participant.id }}</p>
            <p><strong>Is Admin:</strong> {{ participant.isAdmin }}</p>
            <p>
              <strong>Is Super Admin:</strong> {{ participant.isSuperAdmin }}
            </p>
          </li>
        </ul>
        <p><strong>Subject Time:</strong> {{ groupData.subjectTime }}</p>
        <p>
          <strong>Group Invite Link:</strong>
          <a :href="groupData.groupInviteLink">{{
            groupData.groupInviteLink
          }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../main.js";
import * as XLSX from "xlsx";
import axios from "axios";

export default {
  data() {
    return {
      phoneRecords: [],
      newSetting: {
        host: "",
        idInstance: "",
        apiTokenInstance: "",
        userToken: localStorage.getItem("userToken"),
      },
      groups: [],
      groupData: null,
    };
  },
  mounted() {
    this.fetchPhoneRecords();
  },
  methods: {
    async uploadFile(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const userToken = localStorage.getItem("userToken");

        // Save phone numbers to Firestore collection called 'whatsappContacts'
        const phoneNumbers = jsonData.map((row) => row[0]);
        for (const phoneNumber of phoneNumbers) {
          try {
            // Check if the phone number already exists
            const q = query(
              collection(db, "whatsappContacts"),
              where("contactPhoneNumber", "==", phoneNumber)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
              // If the phone number does not exist, add it to the database
              await addDoc(collection(db, "whatsappContacts"), {
                UserContactOwner: userToken,
                contactPhoneNumber: phoneNumber,
                type: "CONTACT",
              });
            }
          } catch (error) {
            console.log(error);
          }
        }

        // Clear the file input
        this.$refs.fileInput.value = "";
        this.fetchPhoneRecords();
      };

      reader.readAsArrayBuffer(file);
    },
    async fetchPhoneRecords() {
      try {
        const userToken = localStorage.getItem("userToken");
        const q = query(
          collection(db, "whatsappContacts"),
          where("UserContactOwner", "==", userToken)
        );
        const querySnapshot = await getDocs(q);
        this.phoneRecords = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.log(error);
      }
    },
    async addGreenApiSetting() {
      try {
        const response = await axios.post(
          "https://us-central1-mywriter-48a45.cloudfunctions.net/addGreenApiSettings",
          this.newSetting
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchContacts() {
      try {
        const userToken = localStorage.getItem("userToken");
        const response = await axios.get(
          `https://us-central1-mywriter-48a45.cloudfunctions.net/getContacts?userToken=${userToken}`
        );
        this.groups = response.data.filter(
          (contact) => contact.type === "group"
        );
      } catch (error) {
        console.log(error);
      }
    },
    async fetchGroupData(groupId) {
      try {
        const userToken = localStorage.getItem("userToken");
        const response = await axios.post(
          "https://us-central1-mywriter-48a45.cloudfunctions.net/getGroupData",
          { groupId, userToken }
        );
        this.groupData = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.small-btn {
  padding:2px 5px;
  font-size: 14px;
}
</style>
