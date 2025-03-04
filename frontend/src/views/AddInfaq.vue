<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Card from "primevue/card";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const users = ref([]);
const selectedUser = ref(null);
const infaqAmount = ref(null);
const paymentMethod = ref("");
const toast = useToast();
const isLoading = ref(false);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch users on mount
onMounted(async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/invoices`);
    users.value = response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

// Submit infaq data
const submitInfaq = async () => {
  if (!selectedUser.value || !infaqAmount.value || !paymentMethod.value) {
    toast.add({ severity: "warn", summary: "Peringatan", detail: "Sila isi semua maklumat.", life: 3000 });
    return;
  }

  try {
    isLoading.value = true;
    await axios.post(`${API_BASE_URL}/api/infaq`, {
      userId: selectedUser.value.noKadPengenalan,
      amount: infaqAmount.value,
      kaedahBayaranInfaq: paymentMethod.value,
    });

    toast.add({ severity: "success", summary: "Berjaya", detail: "Bayaran Infaq berjaya!", life: 3000 });

    // Reset form
    selectedUser.value = null;
    infaqAmount.value = null;
    paymentMethod.value = "";

    // Delay navigation to allow toast to display
    setTimeout(() => {
      router.push("/admin-dashboard");
    }, 2000);

  } catch (error) {
    console.error("Error submitting infaq:", error);
    toast.add({ severity: "error", summary: "Gagal", detail: "Bayaran Infaq gagal.", life: 3000 });
  } finally {
    isLoading.value = false;
  }
};

const paymentMethods = [
  { label: "Tunai kepada AJK", value: "Tunai" },
  { label: "Deposit Tunai", value: "CDM" },
  { label: "Pemindahan Bank dalam Talian", value: "Online Transfer" },
  { label: "Kod QR", value: "QR Code" },
];
</script>

<template>
  <div class="infaq-container">
    <Toast position="top-right" />
    <Card class="infaq-card">
      <template #title>
        <h2 class="text-xl font-bold">Bayaran Infaq Ahli</h2>
      </template>
      <template #content>
        <div class="form-group">
          <label>Pilih Ahli:</label>
          <Dropdown 
            v-model="selectedUser" 
            :options="users" 
            optionLabel="namaAhli" 
            placeholder="Pilih ahli"
            class="w-full mt-2"
            filter
          />
        </div>

        <div class="form-group">
          <label>Jumlah Infaq (RM):</label>
          <InputNumber v-model="infaqAmount" placeholder="Masukkan jumlah infaq" mode="currency" currency="MYR" class="w-full mt-2" />
        </div>

        <div class="form-group">
          <label>Kaedah Bayaran:</label>
          <Dropdown 
            v-model="paymentMethod" 
            :options="paymentMethods" 
            optionLabel="label" 
            optionValue="value"
            placeholder="Pilih kaedah bayaran"
            class="w-full mt-2"
          />
        </div>

        <div class="button-group">
          <Button label="Bayar Infaq" icon="pi pi-save" class="p-button-success w-full" @click="submitInfaq" />
          <Button label="Kembali ke Laman Admin" icon="pi pi-arrow-left" class="p-button-secondary w-full mt-2" @click="router.push('/admin-dashboard')" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.infaq-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--color-background-soft);
}

.infaq-card {
  width: 400px;
  padding: 1.5rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

.button-group {
  margin-top: 1rem;
}

.p-toast {
  max-width: 400px !important;
  width: auto !important;
}
</style>
