<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Card from "primevue/card";
import Button from "primevue/button";

</script>


<template>
  <div class="dashboard-container">
    <Card class="dashboard-card">
      <template #title>
        <h1 class="text-3xl font-bold text-primary">Admin Yuran PAKATAN</h1>
      </template>
      <template #content>
        <div class="flex flex-column gap-3 mt-3">
          <Button 
            label="Daftar Ahli Baru" 
            icon="pi pi-user-plus" 
            class="w-full p-button-primary" 
            @click="$router.push('/add-member')" 
          />
          <Button 
            label="Kemaskini Yuran Ahli" 
            icon="pi pi-file" 
            class="w-full p-button-secondary" 
            @click="$router.push('/add-invoice')" 
          />
          <Button 
            label="Senarai Yuran Ahli" 
            icon="pi pi-list" 
            class="w-full p-button-success" 
            @click="$router.push('/view-invoices')" 
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--color-background-soft);
}

.dashboard-card {
  width: 400px;
  padding: 1.5rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>
  