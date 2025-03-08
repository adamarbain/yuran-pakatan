<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import Card from "primevue/card";
import Toast from "primevue/toast";
import { useRouter } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const invoices = ref([]);
const InfaqUser = ref([]);
const yearRange = ref([]);
const infaqs = ref([]);
const toast = useToast();
const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    toast.add({ severity: "warn", summary: "Redirecting", detail: "User ID not found!", life: 3000 });
    return;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/invoices/${userId}`);
    invoices.value = response.data;

    if (invoices.value.length > 0) {
      const firstUser = invoices.value[0];
      yearRange.value = Object.keys(firstUser)
        .filter((key) => key.startsWith("yuran") && firstUser[key] > 0)
        .map((key) => key.replace("yuran", ""));
    }
  } catch (error) {
    toast.add({ severity: "error", summary: "Error", detail: "Failed to fetch invoices.", life: 3000 });
  }

  try {
    const icNumber = userId; // Get user's IC number from local storage
    const response = await axios.get(`${API_BASE_URL}/api/infaq/${icNumber}`);

    if (response.data) {
      InfaqUser.value = [response.data]; // Store user details
      infaqs.value = response.data.infaqs || []; // Store user's infaq
    }
  } catch (error) {
    console.error("Error fetching user infaq:", error);
    toast.add({ severity: "error", summary: "Error", detail: "Failed to fetch data", life: 3000 });
  }
});

const printInvoice = async (user, year) => {
  const amount = user[`yuran${year}`];
  if (amount > 0) {
    try {
      const invoiceData = {
        namaAhli: user.namaAhli,
        noAhli: user.noAhli,
        alamat: user.alamat,
        tarikh: new Date().toLocaleDateString("ms-MY"),
        jumlah: amount,
        tahun: year,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/invoices/generate-invoice`,
        invoiceData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `RESIT_YURAN_PAKATAN-${user.namaAhli}-${year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.add({ severity: "success", summary: "Berjaya", detail: "Cetakan Resit Berjaya.", life: 3000 });
    } catch (error) {
      toast.add({ severity: "error", summary: "Gagal", detail: "Cetakan Resit Gagal.", life: 3000 });
    }
  } else {
    toast.add({ severity: "warn", summary: "No Payment", detail: `No payment recorded for ${user.namaAhli} in ${year}.`, life: 3000 });
  }
};

const navigateHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="p-2">
    <Toast position="top-right" />
    <Card class="invoice-card">
      <template #title class="label text-3xl">Ringkasan Yuran PAKATAN</template>
      <template #content>
        <div v-if="invoices.length > 0" class="invoice-list">
          <div v-for="(invoice, index) in invoices" :key="index" class="invoice-card-item">
            <p><span class="label">Nama:</span> {{ invoice.namaAhli }}</p>
            <p><span class="label">No Ahli:</span> {{ invoice.noAhli }}</p>
            <p><span class="label">No Kad Pengenalan:</span> {{ invoice.noKadPengenalan }}</p>
            <p><span class="label">No Tel:</span> {{ invoice.noTel }}</p>
            <p><span class="label">Alamat:</span> {{ invoice.alamat }}</p>
            <p><span class="label">Kawasan:</span> {{ invoice.kawasan.toUpperCase() }}</p>

            <div v-for="year in yearRange" :key="year" class="yuran-row">
              <span class="yuran-label">Yuran {{ year }}:</span> 
              <span class="yuran-amount">RM{{ invoice[`yuran${year}`] }}</span>
                <Button 
                v-if="invoice[`yuran${year}`] > 0" 
                icon="pi pi-file-pdf"
                class="w-4"
                @click="printInvoice(invoice, year)"
                >
                Cetak Resit
                </Button>
            </div>
          </div>
        </div>
        <p v-else>No invoices found.</p>
      </template>
    </Card>

    <!-- Infaq DataTable -->
    <Card class="mt-4 invoice-card">
      <template #title>Senarai Infaq</template>
      <template #content>
        <DataTable :value="infaqs" paginator :rows="5" class="p-datatable-sm shadow-md mt-2">
          <Column field="date" header="Tarikh" sortable>
            <template #body="slotProps">
              {{ new Date(slotProps.data.date).toLocaleDateString("en-MY") }}
            </template>
          </Column>
          <Column field="amount" header="Jumlah (RM)" sortable></Column>
          <Column field="kaedahBayaranInfaq" header="Kaedah Bayaran" sortable></Column>
        </DataTable>
      </template>
    </Card>

    <!-- Home Button -->
    <div class="home-button-container">
      <Button label="Kembali ke Laman Utama" class="p-button-secondary" icon="pi pi-arrow-left" @click="navigateHome" />
    </div>
  </div>
</template>


<style scoped>
.invoice-card {
  background: #1e1e1e;
  padding: 5px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(255, 255, 255, 0.1);
  max-width: 600px;
  margin: auto;
}

.invoice-card-item {
  background: #292929;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 6px;
  margin-top: 10px;
  box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.1);
}

.label {
  font-weight: bold;
  color: #f0f0f0;
  margin-top: 0px;
}

.yuran-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
  padding: 8px;
  background: #333;
  border-radius: 4px;
}

.yuran-label {
  flex: 1;
  font-weight: bold;
  color: #ddd;
}

.yuran-amount {
  font-weight: bold;
  color: #40c057; /* Green */
}

.yuran-button {
  margin-left: auto;
}

*{
  font-family: 'inter', sans-serif;
}

.home-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
