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
          <tr v-for="purchase in purchaseHistory" :key="purchase.id">
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
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  
  export default {
    data() {
      return {
        purchaseHistory: [],
      };
    },
    mounted() {
      this.fetchContents();
    },
    methods: {
      fetchContents() {
        const db = firebase.firestore();
        const purchaseHistoryRef = db.collection('purchaseHistory');
  
        purchaseHistoryRef.get().then((querySnapshot) => {
          const purchaseHistory = [];
          querySnapshot.forEach((doc) => {
            purchaseHistory.push(doc.data());
          });
          this.purchaseHistory = purchaseHistory;
        });
      },
    },
  };
  </script>
  