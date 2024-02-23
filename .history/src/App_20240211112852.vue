<template>
  <div id="app">
    <header>
      <img src="./assets/logo.png" alt="Logo" class="logo" />
      <nav>
        <ul class="menu">
          <li v-for="(item, index) in menuItems" :key="index">
            <router-link :to="item.path">{{ item.name }}</router-link>
          </li>
         
            <select v-model="selectedLanguage" @change="changeLanguage">
              <option v-for="(option, index) in languageOptions" :key="index" :value="option.value">{{ option.text }}</option>
            </select>
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
      menuItems: [
        { name: 'My Contents', path: '/my-contents' },
        { name: 'Content Creation', path: '/content-creation' },
        { name: 'Buy Credits', path: '/purchase-credits' },
      ],
      languageOptions: [
        { text: 'Hebrew', value: 'hebrew' },
        { text: 'English', value: 'english' },
      ],
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
  box-shadow: 1px 2px 40px rgba(0, 0, 0, 0.1);
  background-color: silver;
}

.logo {
  width: 100px;
  margin-bottom: 20px;
}

nav {
  margin-top: 20px;
}

.menu {
  border-bottom: 2px solid #333;
}

.menu li {
  margin-right: 10px;
  border: 2px solid #333;
  border-bottom: none;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #fff;
}

.menu li a {
  text-decoration: none;
  color: #333;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  display: block;
  padding: 10px;
}

.menu li a.active {
  background-color: #fff;
}

.menu li select {
  padding: 5px;
  border: none;
  background-color: white;
  color: #007bff;
  border: none;

}

.menu li select option {
  border: none;
}
</style>
