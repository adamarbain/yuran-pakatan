<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
import { useRouter } from "vue-router";

const toast = useToast();
const members = ref([]);
const selectedMember = ref(null);
const year = ref("");
const amount = ref("");
const isLoading = ref(false);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/invoices");
    members.value = response.data;
  } catch (error) {
    toast.add({ severity: "error", summary: "Error", detail: "Failed to fetch members.", life: 3000 });
  }
});

const addInvoice = async () => {
  if (!selectedMember.value || !year.value || !amount.value) {
    toast.add({ severity: "warn", summary: "Validation Error", detail: "Please fill in all fields.", life: 3000 });
    return;
  }

  try {
    isLoading.value = true;
    await axios.put(`http://localhost:5000/api/invoices/${selectedMember.value.id}`, {
      year: `yuran${year.value}`, // Convert 2024 -> yuran2024
      amount: amount.value,
    });

    toast.add({ severity: "success", summary: "Success", detail: "Invoice updated successfully!", life: 3000 });

    // Reset form
    selectedMember.value = null;
    year.value = "";
    amount.value = "";
  } catch (error) {
    toast.add({ severity: "error", summary: "Error", detail: "Failed to update invoice.", life: 3000 });
  } finally {
    isLoading.value = false;
  }
};

const navigateToAdminDashboard = () => {
  router.push("/admin-dashboard");
};
</script>

<template>
  <div class="form-container">
    <Card class="form-card">
      <template #title>
        <h1 class="text-2xl font-bold text-primary">Bayaran Yuran Ahli</h1>
      </template>

      <template #content>
        <div class="flex flex-column gap-3">
          <label>Pilih Ahli</label>
          <Dropdown 
            v-model="selectedMember" 
            :options="members" 
            optionLabel="namaAhli" 
            placeholder="Pilih Ahli" 
            class="w-full p-inputtext-lg"
            :filter="true"
          />

          <label>Tahun</label>
          <InputText v-model="year" placeholder="Masukkan Tahun (e.g., 2024)" class="p-inputtext-lg w-full" />

          <label>Jumlah</label>
          <InputText v-model="amount" placeholder="Masukkan Jumlah" class="p-inputtext-lg w-full" />

          <Button 
            :label="isLoading ? 'Mengemaskini...' : 'Bayar Yuran'" 
            icon="pi pi-file" 
            class="p-button-primary w-full mt-3" 
            :disabled="isLoading" 
            @click="addInvoice" 
          />
        </div>
      </template>
    </Card>

    <!-- Home Button -->
    <div class="home-button-container">
      <Button label="Kembali ke Laman Admin" class="p-button-secondary w-full" icon="pi pi-arrow-left" @click="navigateToAdminDashboard" />
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
  padding: 1.5rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.home-button-container {
  margin-top: 10px;
  width: 450px;
}
</style>
