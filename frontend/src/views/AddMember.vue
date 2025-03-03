<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import router from "@/router";

const toast = useToast();

const memberData = ref({
  namaAhli: "",
  noAhli: "",
  noKadPengenalan: "",
  alamat: "",
  kawasan: "",
  noTel: "",
  yuranDaftar: null,
});

const isLoading = ref(false);

const addMember = async () => {
  if (!memberData.value.namaAhli || !memberData.value.noAhli || !memberData.value.noKadPengenalan) {
    toast.add({ severity: "warn", summary: "Validation Error", detail: "Please fill in all required fields.", life: 3000 });
    return;
  }

  try {
    isLoading.value = true;
    await axios.post("http://localhost:5000/api/invoices", memberData.value);
    toast.add({ severity: "success", summary: "Success", detail: "Member added successfully!", life: 3000 });

    // Reset form
    Object.keys(memberData.value).forEach((key) => (memberData.value[key] = ""));
  } catch (error) {
    toast.add({ severity: "error", summary: "Error", detail: "Failed to add member.", life: 3000 });
  } finally {
    isLoading.value = false;
    router.push("/admin-dashboard");
  }
};

const invoices = ref([]);

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

const navigateHome = () => {
  router.push("/admin-dashboard");
};

</script>

<template>
  <div class="form-container">
    <Card class="form-card">
      <template #title>
        <h1 class="text-2xl font-bold text-primary">Daftar Ahli PAKATAN Baru</h1>
      </template>

      <template #content>
        <div class="flex flex-column gap-3">
          <label>Nama Ahli</label>
          <InputText v-model="memberData.namaAhli" placeholder="Masukkan Nama Ahli" class="p-inputtext-lg w-full" required />

          <label>No Ahli</label>
          <InputText v-model="memberData.noAhli" placeholder="Masukkan No Ahli" class="p-inputtext-lg w-full" required />

          <label>No Kad Pengenalan</label>
          <InputText v-model="memberData.noKadPengenalan" placeholder="Masukkan No Kad Pengenalan" class="p-inputtext-lg w-full" required />
          <small class="text-gray-500">*Sila Masukkan No Kad Pengenalan Termasuk Simbol (-)</small>

          <label>Alamat</label>
          <Textarea v-model="memberData.alamat" placeholder="Masukkan Alamat" class="p-inputtext-lg w-full" autoResize />

          <label>Kawasan</label>
          <Dropdown v-model="memberData.kawasan" :options="uniqueKawasanOptions" placeholder="Pilih Kawasan" class="p-inputtext-lg w-full" />

          <label>No Telefon</label>
          <InputText v-model="memberData.noTel" placeholder="Masukkan No Telefon" class="p-inputtext-lg w-full" />

          <label>Yuran Pendaftaran</label>
          <InputText v-model="memberData.yuranDaftar" placeholder="Masukkan Yuran Pendaftaran" class="p-inputtext-lg w-full" type="number" />

          <Button 
            :label="isLoading ? 'Adding...' : 'Daftar Ahli Baru'" 
            icon="pi pi-user-plus" 
            class="p-button-primary w-full mt-3" 
            :disabled="isLoading" 
            @click="addMember" 
          />
        </div>
      </template>
    </Card>

    <!-- Home Button -->
    <div class="home-button-container">
      <Button label="Kembali ke Laman Admin" class="p-button-secondary w-full" icon="pi pi-arrow-left" @click="navigateHome" />
    </div>

    <Toast />
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--color-background-soft);
}

.form-card {
  width: 450px;
  max-height: 80vh; /* Set maximum height */
  padding: 0.5rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow-y: auto; /* Enable vertical scrolling */
}

.home-button-container {
  margin-top: 10px;
  width: 450px;
}
</style>
