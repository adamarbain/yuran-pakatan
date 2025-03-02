<script setup>
import { ref } from "vue";
import axios from "axios";

const memberData = ref({
  namaAhli: "",
  noAhli: "",
  noKadPengenalan: "",
  alamat: "",
  kawasan: "",
  noTel: "",
});

const addMember = async () => {
  try {
    await axios.post("http://localhost:5000/api/invoices", memberData.value);
    alert("Member added successfully!");
    Object.keys(memberData.value).forEach((key) => (memberData.value[key] = "")); // Reset form
  } catch (error) {
    alert("Error adding member.");
  }
};
</script>

<template>
  <div>
    <h1>Add New Member</h1>
    <input v-model="memberData.namaAhli" placeholder="Nama Ahli" />
    <input v-model="memberData.noAhli" placeholder="No Ahli" />
    <input v-model="memberData.noKadPengenalan" placeholder="No Kad Pengenalan" />
    <input v-model="memberData.alamat" placeholder="Alamat" />
    <input v-model="memberData.kawasan" placeholder="Kawasan" />
    <input v-model="memberData.noTel" placeholder="No Tel" />
    <button @click="addMember">Add Member</button>
  </div>
</template>
