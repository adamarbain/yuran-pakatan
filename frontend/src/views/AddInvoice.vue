<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const members = ref([]);
const selectedMember = ref(null);
const year = ref("");
const amount = ref("");

onMounted(async () => {
  const response = await axios.get("http://localhost:5000/api/invoices");
  members.value = response.data;
});

const addInvoice = async () => {
  if (!selectedMember.value) {
    alert("Please select a member.");
    return;
  }

  console.log("Selected Member: ",selectedMember.value);
  console.log("Year: ", "yuran" + year.value);
  console.log("Amount: ",amount.value);
  try {
    await axios.put(`http://localhost:5000/api/invoices/${selectedMember.value.id}`, {
      year: `yuran${year.value}`, // Convert 2024 -> yuran2024
      amount: amount.value,
    });

    alert("Invoice updated successfully!");
    year.value = "";
    amount.value = "";
  } catch (error) {
    console.error("Error updating invoice:", error);
    alert("Error updating invoice.");
  }
};

</script>

<template>
  <div>
    <h1>Add Invoice</h1>
    <select v-model="selectedMember" placeholder="Select Member">
      <option v-for="member in members" :key="member.id" :value="member">
        {{ member.namaAhli }}
      </option>
    </select>

    <input v-model="year" placeholder="Enter Year (e.g., 2024)" />
    <input v-model="amount" placeholder="Enter Amount" />
    <button @click="addInvoice">Add Invoice</button>
  </div>
</template>
