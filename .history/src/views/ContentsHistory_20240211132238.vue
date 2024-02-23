<template>
  <div>
    <h1>Purchase History</h1>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Title</th>
          <th>Content</th>
          <th>Keywords</th>
          <th>Images</th>
          <th>Category</th>
          <th>Audio</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="purchase in contents" :key="purchase.id">
          <td>{{ purchase.date }}</td>
          <td>{{ purchase.title }}</td>
          <td>{{ purchase.content }}</td>
          <td>{{ purchase.keywords }}</td>
          <td>
            <ul>
              <li v-for="image in purchase.images" :key="image">{{ image }}</li>
            </ul>
          </td>
          <td>{{ purchase.category }}</td>
          <td>{{ purchase.audio }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { firebaseApp } from '../main.js';


export default {
  data() {
    return {
      contents: [],
    };
  },
  mounted() {
    this.fetchContents();
  },
  methods: {
    async fetchContents() {
      const db = firebaseApp.firestore();
      const purchaseHistoryRef = db.collection("generatedContent");

      const querySnapshot = await purchaseHistoryRef.get();
      this.contents = querySnapshot.docs.map((doc) => doc.data());
    },
  },
};
</script>
