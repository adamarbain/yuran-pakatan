<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast();

const icNumber = ref("");
const username = ref("");
const password = ref("");
const userType = ref("user");

const userOptions = [
  { label: "Ahli Biasa", value: "user" },
  { label: "Ahli Admin", value: "admin" },
];

const login = async () => {
  try {
    if (userType.value === "user") {
      const response = await axios.post("http://localhost:5000/api/auth/user-login", { icNumber: icNumber.value });
      localStorage.setItem("userId", icNumber.value);
      toast.add({ severity: "success", summary: "Log Masuk Berjaya", detail: "Sila Tunggu Sebentar...", life: 2000 });
      setTimeout(() => router.push("/invoices"), 1500);
    } else if (userType.value === "admin") {
      const response = await axios.post("http://localhost:5000/api/auth/admin-login", {
        username: username.value,
        password: password.value,
      });
      localStorage.setItem("token", response.data.token);
      toast.add({ severity: "success", summary: "Log Masuk Berjaya", detail: "Sila Tunggu Sebentar...", life: 2000 });
      setTimeout(() => router.push("/admin-dashboard"), 1500);
    }
  } catch (error) {
    toast.add({ severity: "error", summary: "Login Failed", detail: "Periksa No Kad Pengenalan", life: 3000 });
  }
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-4">
    <div class="surface-card p-5 shadow-2 border-round w-full max-w-md">
      <h2 class="text-center mb-4">Yuran Persatuan Kebajikan Am Taman Meru (PAKATAN)</h2>

      <!-- Add text below the title -->
      <p class="text-center mb-4">Sila Masukkan No Kad Pengenalan untuk Memeriksa Status Yuran Tahunan</p>
      
      

      <Toast />

      <div class="mb-4">
        <label class="block mb-2">Jenis Pengguna</label>
        <Dropdown v-model="userType" :options="userOptions" optionLabel="label" optionValue="value" class="w-full" />
      </div>

      <div v-if="userType === 'user'" class="mb-4">
        <label class="block mb-2">No Kad Pengenalan</label>
        <InputText v-model="icNumber" class="w-full p-inputtext-lg" placeholder="Masukkan No Kad Pengenalan" />
      </div>

      <div v-else>
        <div class="mb-4">
          <label class="block mb-2">Admin Username</label>
          <InputText v-model="username" class="w-full p-inputtext-lg" placeholder="Enter Username" />
        </div>
        <div class="mb-4">
          <label class="block mb-2">Admin Password</label>
          <Password v-model="password" class="w-full" toggleMask :feedback="false" placeholder="Enter Password" />
        </div>
      </div>

      <Button label="Log Masuk" class="w-full p-button-lg font-bold" @click="login" />
    </div>
  </div>
</template>

<style>
*{
  font-family: 'inter', sans-serif;
}
</style>
