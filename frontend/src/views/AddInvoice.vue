<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
import { useRouter } from "vue-router";

const toast = useToast();
const members = ref([]);
const selectedMember = ref(null);
const year = ref("");
const amount = ref("");
const paymentMethod = ref("");
const remarks = ref("");
const isLoading = ref(false);
const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/invoices`);
    members.value = response.data;
  } catch (error) {
    toast.add({ severity: "error", summary: "Error", detail: "Failed to fetch members.", life: 3000 });
  }
});

const addInvoice = async () => {
  if (!selectedMember.value || !year.value || !amount.value || !paymentMethod.value) {
    toast.add({ severity: "warn", summary: "Peringatan", detail: "Sila isi semua maklumat.", life: 3000 });
    return;
  }

  try {
    isLoading.value = true;
    await axios.put(`${API_BASE_URL}/api/invoices/${selectedMember.value.id}`, {
      year: `yuran${year.value}`, // Convert 2024 -> yuran2024
      amount: amount.value,
      kaedahBayaran: paymentMethod.value,
      nota: remarks.value,
    });

    toast.add({ severity: "success", summary: "Berjaya", detail: "Bayaran Yuran Berjaya!", life: 3000 });

    // Reset form
    selectedMember.value = null;
    year.value = "";
    amount.value = "";

    // Delay navigation to allow toast to display
    setTimeout(() => {
      router.push("/admin-dashboard");
    }, 2000);

  } catch (error) {
    toast.add({ severity: "error", summary: "Gagal", detail: "Bayaran Yuran Gagal.", life: 3000 });
  } finally {
    isLoading.value = false;
  }
};

const navigateToAdminDashboard = () => {
  router.push("/admin-dashboard");
};

const paymentMethods = [
  { label: "Tunai kepada AJK", value: "Tunai" },
  { label: "Deposit Tunai", value: "CDM" },
  { label: "Pemindahan Bank dalam Talian", value: "Online Transfer" },
  { label: "Kod QR", value: "QR Code" },
];
</script>

<template>
  <div class="form-container">
    <Toast position="top-right" />
    <Card class="form-card">
      <template #title>
        <h1 class="text-2xl font-bold text-primary text-center">Bayaran Yuran Ahli</h1>
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

          <label>Kaedah Pembayaran</label>
          <Dropdown 
            v-model="paymentMethod" 
            :options="paymentMethods" 
            optionLabel="label" 
            optionValue="value"
            placeholder="Pilih Kaedah Pembayaran" 
            class="w-full p-inputtext-lg"
          />

          <label>Nota</label>
          <Textarea v-model="remarks" placeholder="Masukkan Nota" class="p-inputtext-lg w-full" autoResize />

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
      <Button 
        label="Kembali ke Laman Admin" 
        class="p-button-secondary w-full" 
        icon="pi pi-arrow-left" 
        @click="navigateToAdminDashboard" 
      />
    </div>
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--color-background-soft);
}

/* Responsive form card */
.form-card {
  width: 100%;
  max-width: 450px;
  min-width: 300px;
  padding: 1.5rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* Responsive button container */
.home-button-container {
  margin-top: 10px;
  width: 100%;
  max-width: 450px;
  text-align: center;
}

/* Adjustments for smaller screens */
@media (max-width: 480px) {
  .form-card {
    width: 90%;
    padding: 1rem;
  }

  .form-container {
    padding: 0.5rem;
  }
}

.p-toast {
  max-width: 400px !important;
  width: auto !important;
}
</style>

