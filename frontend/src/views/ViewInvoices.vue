<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import  Dropdown  from "primevue/dropdown";
import  DataTable  from "primevue/datatable";
import  Column  from "primevue/column";


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
  <div class="p-5">
    <h1 class="text-2xl font-semibold mb-4">Senarai Ahli</h1>

    <div class="mb-4">
      <Dropdown 
        v-model="selectedKawasan" 
        :options="uniqueKawasanOptions" 
        placeholder="Pilih Kawasan" 
        class="w-full md:w-60" 
        filter
      />
    </div>

    <DataTable :value="filteredInvoices" paginator :rows="10" class="p-datatable-sm shadow-md">
      <Column field="namaAhli" header="Nama Ahli" sortable></Column>
      <Column field="noAhli" header="No Ahli" sortable></Column>
      <Column field="noKadPengenalan" header="No Kad Pengenalan"></Column>
      <Column field="kawasan" header="Kawasan" sortable></Column>
      <Column field="alamat" header="Alamat"></Column>
      <Column field="noTel" header="No Tel"></Column>
      <Column field="yuran2021" header="Yuran 2021"></Column>
      <Column field="yuran2022" header="Yuran 2022"></Column>
      <Column field="yuran2023" header="Yuran 2023"></Column>
      <Column field="yuran2024" header="Yuran 2024"></Column>
      <Column field="yuran2025" header="Yuran 2025"></Column>
      <Column field="yuran2026" header="Yuran 2026"></Column>
      <Column field="yuran2027" header="Yuran 2027"></Column>
      <Column field="yuran2028" header="Yuran 2028"></Column>
      <Column field="yuran2029" header="Yuran 2029"></Column>
      <Column field="yuran2030" header="Yuran 2030"></Column>
      <Column field="yuran2031" header="Yuran 2031"></Column>
      <Column field="yuran2032" header="Yuran 2032"></Column>
    </DataTable>
  </div>
</template>
