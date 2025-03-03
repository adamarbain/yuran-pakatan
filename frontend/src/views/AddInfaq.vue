<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Card from "primevue/card";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import { useRouter } from "vue-router";

const router = useRouter();
const users = ref([]);
const selectedUser = ref(null);
const infaqAmount = ref(null);

// Fetch users on mount
onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/auth/users");
    users.value = response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

// Submit infaq data
const submitInfaq = async () => {
  if (!selectedUser.value || !infaqAmount.value) {
    alert("Sila pilih pengguna dan masukkan jumlah infaq.");
    return;
  }

  try {
    await axios.post("http://localhost:5000/api/infaq", {
      userId: selectedUser.value.icNumber,
      amount: infaqAmount.value,
    });

    alert("Infaq berjaya dikemaskini!");
    router.push("/admin-dashboard");
  } catch (error) {
    console.error("Error submitting infaq:", error);
    alert("Gagal mengemaskini infaq.");
  }
};
</script>

<template>
  <div class="infaq-container">
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
            optionLabel="username" 
            placeholder="Pilih ahli"
            class="w-full mt-2"
            filter
          />
        </div>

        <div class="form-group">
          <label>Jumlah Infaq (RM):</label>
          <InputNumber v-model="infaqAmount" placeholder="Masukkan jumlah infaq" mode="currency" currency="MYR" class="w-full mt-2" />
        </div>

        <div class="button-group">
          <Button label="Bayar" icon="pi pi-save" class="p-button-success w-full" @click="submitInfaq" />
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
</style>
