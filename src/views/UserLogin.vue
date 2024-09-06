<template>
  <div style="text-align: center">
    <h1>Login</h1>
    <div class="center block">
      <form @submit.prevent="loginWithEmailPassword">
        <div>
          <input
            type="email"
            id="email"
            placeholder="Email"
            v-model="email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            placeholder="Password"
            v-model="password"
            required
          />
        </div>
        <div class="margin-top-10"><button type="submit">Login</button></div>
      </form>
    </div>
    <div class="center block margin-top-30">
      <button @click="loginWithGmail">Login with Gmail</button>
    </div>
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
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
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
          console.log("2828282828-- " + response.data);
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
          this.$router.push("/set-up");
          console.error(error);
        });
    },
    loginWithEmailPassword() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((res) => {
          //console.log(JSON.stringify(res.user));
          const user = res.user;
          localStorage.setItem("userToken", user.uid);
          this.redirect(user.uid);
        })
        .catch((error) => {
          console.log(error);
          if (error.code === "auth/user-not-found") {
            // Redirect to the registration page
            this.$router.push("/set-up");
          } else {
            // Show error modal for other errors
            this.showModal = true;
            this.modalMessage = error.message;
          }
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
      if (event.key === "userToken" && !event.newValue) {
        this.$router.push("/login");
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
<style>
.center {
  margin: 0 auto;
  width: 50%;
}
.block {
  display: block;
}
.margin-top-10 {
  margin-top: 10px;
}
.margin-top-30 {
  margin-top: 30px;
}
</style>
