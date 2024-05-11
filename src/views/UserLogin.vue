<script>
import { auth } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { PhoneAuthProvider } from "firebase/auth";
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
    loginWithPhone() {
      const provider = new PhoneAuthProvider(auth);
      signInWithPopup(auth, provider)
        .then(() => {
          // Handle login success
        })
        .catch((error) => {
          this.showModal = true;
          this.modalMessage = error.message;
          console.error(error);
        });
    },
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
