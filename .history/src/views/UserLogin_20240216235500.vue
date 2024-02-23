<template>
  <div class="login-container">
    <h1>Login</h1>
    <div class="login-form">
      <!-- <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email" placeholder="Enter your email" />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="password" placeholder="Enter your password" />
            </div> -->
      <!-- <button @click="loginWithEmailPassword">Login with Email/Password</button> -->
      <button @click="loginWithGmail">Login with Gmail</button>
      <!-- <button @click="loginWithPhone">Login with Phone</button> -->
    </div>
  </div>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <p>{{ modalMessage }}</p>
    </div>
  </div>
</template>

<script>
// Import the necessary Firebase modules using the new modular syntax
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  PhoneAuthProvider,
} from "firebase/auth";
import { collection, where, getDocs, query, addDoc } from "firebase/firestore";
import { db } from "../main.js";

export default {
  data() {
    return {
      email: "",
      password: "",
      showModal: false,
      modalMessage: "",
    };
  },
  methods: {
    redirect(userId) {
      console.log(userId);
      if (userId) {
        // Check if user exists in Firebase collection
        // Replace 'users' with the name of your collection
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("userToken", "==", userId));
        getDocs(userQuery)
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              const newUser = {
                userToken: userId,
              };
              addDoc(usersRef, newUser)
                .then((docRef) => {
                  console.log("Document written with ID: ", docRef.id);
                  // After adding the new user, redirect to /set-up
                  this.$router.push("/set-up");
                })
                .catch((error) => {
                  console.error("Error adding document: ", error);
                });
            } else {
              // User found in collection, redirect to /home-page
              let user = querySnapshot.docs[0].data();
              console.log("User found in collection", user);
              localStorage.setItem("user", JSON.stringify(user));
              this.$store.commit("setIsLoggedIn", false);
              this.$router.push("/home-page");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }

    },
    loginWithEmailPassword() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          // this.redirect(auth);
        })
        .catch((error) => {
          // Handle login error
          this.showModal = true;
          this.modalMessage = error.message;
          console.error(error);
        });
    },
    loginWithGmail() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((userCredential) => {
          // Login successful
          const user = userCredential.user;
          localStorage.setItem("userToken", user.uid); // Store user UID in local storage

          this.redirect(user.uid);
        })
        .catch((error) => {
          // Handle login error
          this.showModal = true;
          this.modalMessage = error.message;
          console.error(error);
        });
    },
    loginWithPhone() {
      const auth = getAuth();
      const provider = new PhoneAuthProvider(auth);
      // Note: signInWithPopup might not be the correct method for phone auth,
      // you might need to use signInWithPhoneNumber instead, depending on your setup.
      // This example uses signInWithPopup as a placeholder.
      signInWithPopup(auth, provider)
        .then(() => {
          // Login successful
          //this.redirect(auth);
        })
        .catch((error) => {
          // Handle login error
          this.showModal = true;
          this.modalMessage = error.message;
          console.error(error);
        });
    },
    closeModal() {
      this.showModal = false;
      this.modalMessage = "";
    },
  },
  mounted() {
    console.log("UserLogin component mounted");
  },
  beforeCreate() {
    // Check if user is already logged in
    localStorage.clear();
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 10px;
}

label {
  font-weight: bold;
}

input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 300px;
  border-radius: 5px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
