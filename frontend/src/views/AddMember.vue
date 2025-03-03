<script setup>
import { ref } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";

const toast = useToast();

const memberData = ref({
  namaAhli: "",
  noAhli: "",
  noKadPengenalan: "",
  alamat: "",
  kawasan: "",
  noTel: "",
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
  }
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
          <InputText v-model="memberData.namaAhli" placeholder="Enter Nama Ahli" class="p-inputtext-lg w-full" required />

          <label>No Ahli</label>
          <InputText v-model="memberData.noAhli" placeholder="Enter No Ahli" class="p-inputtext-lg w-full" required />

          <label>No Kad Pengenalan</label>
          <InputText v-model="memberData.noKadPengenalan" placeholder="Enter No Kad Pengenalan" class="p-inputtext-lg w-full" required />

          <label>Alamat</label>
          <Textarea v-model="memberData.alamat" placeholder="Enter Alamat" class="p-inputtext-lg w-full" autoResize />

          <label>Kawasan</label>
          <InputText v-model="memberData.kawasan" placeholder="Enter Kawasan" class="p-inputtext-lg w-full" />

          <label>No Tel</label>
          <InputText v-model="memberData.noTel" placeholder="Enter No Tel" class="p-inputtext-lg w-full" />

          <Button 
            :label="isLoading ? 'Adding...' : 'Add Member'" 
            icon="pi pi-user-plus" 
            class="p-button-primary w-full mt-3" 
            :disabled="isLoading" 
            @click="addMember" 
          />
        </div>
      </template>
    </Card>

    <Toast />
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
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
</style>
