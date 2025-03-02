<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const icNumber = ref("");
const username = ref("");
const password = ref("");
const userType = ref("user");

const login = async () => {
  try {
    if (userType.value === "user") {
      const response = await axios.post("http://localhost:5000/api/auth/user-login", { icNumber: icNumber.value });
      console.log("User Response:", response.data);
      localStorage.setItem("userId", icNumber.value);
      console.log("Navigating to /invoices...");
      router.push("/invoices");
    } else if (userType.value === "admin") {
      const response = await axios.post("http://localhost:5000/api/auth/admin-login", {
        username: username.value,
        password: password.value,
      });
      console.log("Admin Response:", response.data);
      localStorage.setItem("token", response.data.token);
      console.log("Navigating to /admin-dashboard...");
      router.push("/admin-dashboard");
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert("Login failed! Check your credentials.");
  }
};

</script>

<template>
  <div>
    <select v-model="userType">
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>

    <div v-if="userType === 'user'">
      <input v-model="icNumber" placeholder="Enter IC Number" />
    </div>

    <div v-else>
      <input v-model="username" placeholder="Admin Username" />
      <input v-model="password" type="password" placeholder="Admin Password" />
    </div>

    <button @click="login">Login</button>
  </div>
</template>
