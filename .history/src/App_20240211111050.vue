<template>
  <div id="app">
    <header>
      <img src="./assets/logo.png" alt="Logo" class="logo" />
      <nav>
        <ul class="menu">
          <li><router-link to="/my-contents">My Contents</router-link></li>
          <li>
            <router-link to="/content-creation">Content Creation</router-link>
          </li>
          <li><router-link to="/purchase-credits">Buy Credits</router-link></li>
          <li>
            <select v-model="selectedLanguage" @change="changeLanguage">
              <option value="hebrew">Hebrew</option>
              <option value="english">English</option>
            </select>
          </li>
        </ul>
      </nav>
    </header>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      selectedLanguage: "english",
    };
  },
  methods: {
    changeLanguage() {
      localStorage.setItem("language", this.selectedLanguage);
    },
  },
  components: {},
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  /* background-color: #f5f8fa; */
  padding: 20px;
}
.logo {
  width: 100px;
  margin-bottom: 20px;
}
.menu {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  margin-right: 10px;
}

.menu li a {
  text-decoration: none;
  color: #333;
}

.router-view {
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

/* Add your custom Twitter-like styles here */

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: #555;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

header {
  /* background-color: #007bff; */

}
.main-content{
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 100px;
  margin-bottom: 20px;
}

nav {
  margin-top: 20px;
}

.menu {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  margin-right: 10px;
}

.menu li a {
  text-decoration: none;
  color: white;
}

.menu li select {
  padding: 5px;
  border: none;
  background-color: white;
  color: #007bff;
}
</style>
