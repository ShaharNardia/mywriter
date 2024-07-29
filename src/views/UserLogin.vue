<template>
  <div style="text-align: center;">
    <h1>Login</h1>
    <!-- <form @submit.prevent="loginWithEmailPassword">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required>
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required>
      <button type="submit">Login</button>
    </form> -->
    <button @click="loginWithGmail">Login with Gmail</button>
    <!-- Uncomment the following button if you want to enable phone login -->
    <!-- <button @click="loginWithPhone">Login with Phone</button> -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <p>{{ modalMessage }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from "axios";

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
      axios
        .get(`https://getuser-ibnrirhwvq-uc.a.run.app?userToken=${userId}`)
        .then((response) => {
          if (response.data) {
            console.log(response.data);
            this.$store.commit("setIsLoggedIn", true);
            localStorage.setItem("user", JSON.stringify(response.data));
            this.$router.push("/home-page");
          } else {
            this.$router.push("/set-up");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    loginWithEmailPassword() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          // Continue as necessary, probably redirecting or updating UI
        })
        .catch((error) => {
          this.showModal = true;
          this.modalMessage = error.message;
          console.error(error);
        });
    },
    loginWithGmail() {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((userCredential) => {
          const user = userCredential.user;
          localStorage.setItem("userToken", user.uid);
          this.redirect(user.uid);
        })
        .catch((error) => {
          this.showModal = true;
          this.modalMessage = error.message;
          console.error(error);
        });
    },
    // loginWithPhone() {
    //   const provider = new PhoneAuthProvider(auth);
    //   signInWithPopup(auth, provider)
    //     .then(() => {
    //       // Handle login success
    //     })
    //     .catch((error) => {
    //       this.showModal = true;
    //       this.modalMessage = error.message;
    //       console.error(error);
    //     });
    // },
    closeModal() {
      this.showModal = false;
      this.modalMessage = "";
    },
    handleStorageChange(event) {
      if (event.key === 'userToken' && !event.newValue) {
        this.$router.push('/login');
      }
    },
  },
  mounted() {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      const auth = getAuth();
      auth.onAuthStateChanged((user) => {
        if (user && user.uid === userToken) {
          this.redirect(user.uid);
        } else {
          localStorage.removeItem("userToken");
          this.$router.push("/login");
        }
      });
    } else {
      this.$router.push("/login");
    }
  },
  created() {
    window.addEventListener("storage", this.handleStorageChange);
  },
};
</script>
