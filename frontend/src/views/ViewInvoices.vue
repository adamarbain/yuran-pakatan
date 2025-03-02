<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const invoices = ref([]);
const selectedKawasan = ref("");

onMounted(async () => {
  const response = await axios.get("http://localhost:5000/api/invoices");
  invoices.value = response.data;
  console.log("Invoices: ", invoices.value);
});

// Get unique kawasan values
const uniqueKawasanOptions = computed(() => {
  const normalizedKawasan = invoices.value.map(invoice => invoice.kawasan.toLowerCase());
  return [...new Set(normalizedKawasan)];
});

// Filter invoices based on selected kawasan
const filteredInvoices = computed(() => {
  if (!selectedKawasan.value) return invoices.value;
  return invoices.value.filter((invoice) => invoice.kawasan.toLowerCase() === selectedKawasan.value);
});
</script>

<template>
  <div>
    <h1>View All Invoices</h1>
    <select v-model="selectedKawasan">
      <option value="">All Kawasan</option>
      <option v-for="kawasan in uniqueKawasanOptions" :key="kawasan" :value="kawasan">
        {{ kawasan }}
      </option>
    </select>

    <table border="1">
      <thead>
        <tr>
          <th>Nama Ahli</th>
          <th>No Ahli</th>
          <th>No Kad Pengenalan</th>
          <th>Kawasan</th>
          <th>Alamat</th>
          <th>No Tel</th>
          <th>Yuran 2021</th>
          <th>Yuran 2022</th>
          <th>Yuran 2023</th>
          <th>Yuran 2024</th>
          <th>Yuran 2025</th>
          <th>Yuran 2026</th>
          <th>Yuran 2027</th>
          <th>Yuran 2028</th>
          <th>Yuran 2029</th>
          <th>Yuran 2030</th>
          <th>Yuran 2031</th>
          <th>Yuran 2032</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="invoice in filteredInvoices" :key="invoice.id">
          <td>{{ invoice.namaAhli }}</td>
          <td>{{ invoice.noAhli }}</td>
          <td>{{ invoice.noKadPengenalan }}</td>
          <td>{{ invoice.kawasan }}</td>
          <td>{{ invoice.alamat }}</td>
          <td>{{ invoice.noTel }}</td>
          <td>{{ invoice.yuran2021 }}</td>
          <td>{{ invoice.yuran2022 }}</td>
          <td>{{ invoice.yuran2023 }}</td>
          <td>{{ invoice.yuran2024 }}</td>
          <td>{{ invoice.yuran2025 }}</td>
          <td>{{ invoice.yuran2026 }}</td>
          <td>{{ invoice.yuran2027 }}</td>
          <td>{{ invoice.yuran2028 }}</td>
          <td>{{ invoice.yuran2029 }}</td>
          <td>{{ invoice.yuran2030 }}</td>
          <td>{{ invoice.yuran2031 }}</td>
          <td>{{ invoice.yuran2032 }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
