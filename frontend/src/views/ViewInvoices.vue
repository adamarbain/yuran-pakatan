<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "vue-router";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const invoices = ref([]);
const selectedKawasan = ref("");
const router = useRouter();
const toast = useToast();
const infaqList = ref([]);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
  const response = await axios.get(`${API_BASE_URL}/api/invoices`);
  invoices.value = response.data;
  // console.log("Invoices: ", invoices.value);

  // Fetch infaq data from backend
  try {
    const response = await axios.get(`${API_BASE_URL}/api/infaq/alluser/infaq`);
    infaqList.value = response.data;
    // console.log("Infaq data: ", infaqList.value);
  } catch (error) {
    console.error("Error fetching infaq data:", error);
    toast.add({ severity: "error", summary: "Error", detail: "Gagal memuatkan data infaq.", life: 3000 });
  }
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

// Export to XLSX (Excel)
const exportToXlsx = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredInvoices.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
  XLSX.writeFile(workbook, "Senarai Ahli PAKATAN.xlsx");
  toast.add({
    severity: "success",
    summary: "Exported to Excel",
    life: 3000,
  });
};

const exportToPdf = () => {
  const doc = new jsPDF({
    orientation: "landscape", // Landscape mode for better width management
    unit: "mm",
    format: "a4",
  });

  doc.text("Senarai Ahli PAKATAN", 14, 10);

  const tableColumn = [
    "Nama Ahli", "No Ahli", "No Kad Pengenalan", "Kawasan", "Alamat", "No Tel",
    "2021", "2022", "2023", "2024", "2025",
    "2026", "2027", "2028", "2029", "2030",
    "2031", "2032"
  ];

  const tableRows = filteredInvoices.value.map(invoice => [
    invoice.namaAhli,
    invoice.noAhli,
    invoice.noKadPengenalan,
    invoice.kawasan,
    invoice.alamat,
    invoice.noTel,
    invoice.yuran2021,
    invoice.yuran2022,
    invoice.yuran2023,
    invoice.yuran2024,
    invoice.yuran2025,
    invoice.yuran2026,
    invoice.yuran2027,
    invoice.yuran2028,
    invoice.yuran2029,
    invoice.yuran2030,
    invoice.yuran2031,
    invoice.yuran2032
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    styles: {
      fontSize: 8, // Reduce font size to fit more data
      cellPadding: 1, // Add some padding for spacing
    },
    columnStyles: {
      0: { cellWidth: 30 }, // Nama Ahli
      1: { cellWidth: 20 }, // No Ahli
      2: { cellWidth: 30 }, // No Kad Pengenalan
      3: { cellWidth: 20 }, // Kawasan
      4: { cellWidth: 40 }, // Alamat
      5: { cellWidth: 25 }, // No Tel
      6: { cellWidth: 12, halign: "center" }, // Yuran
      7: { cellWidth: 12, halign: "center" },
      8: { cellWidth: 12, halign: "center" },
      9: { cellWidth: 12, halign: "center" },
      10: { cellWidth: 12, halign: "center" },
      11: { cellWidth: 12, halign: "center" },
      12: { cellWidth: 12, halign: "center" },
      13: { cellWidth: 12, halign: "center" },
      14: { cellWidth: 12, halign: "center" },
      15: { cellWidth: 12, halign: "center" },
      16: { cellWidth: 12, halign: "center" },
      17: { cellWidth: 12, halign: "center" }
    },
    headStyles: {
      fillColor: [41, 128, 185], // Blue header
      textColor: [255, 255, 255], // White text
      fontSize: 10,
    },
    alternateRowStyles: { fillColor: [240, 240, 240] }, // Light grey for alternating rows
    margin: { top: 15 }
  });

  doc.save("Senarai Ahli PAKATAN.pdf");

  toast.add({
    severity: "success",
    summary: "PDF Exported",
    life: 5000,
  });
};

// Format the data for display
const formattedInfaqList = computed(() => {
  return infaqList.value.map((item) => ({
    id: item.id,
    namaAhli: item.user.username,
    noKadPengenalan: item.user.icNumber,
    amount: item.amount,
    kaedahBayaran: item.kaedahBayaranInfaq,
    tarikh: new Date(item.date).toLocaleDateString("ms-MY"), // Format date
  }));
});

const navigateToAdminDashboard = () => {
  router.push("/admin-dashboard");
};
</script>

<template>
  <div class="p-5">
    <h1 class="text-2xl font-semibold mb-4">Senarai Ahli PAKATAN</h1>
    <Toast position="top-right" />

    <div class="mb-4 flex gap-3">
      <Dropdown v-model="selectedKawasan" :options="uniqueKawasanOptions" placeholder="Pilih Kawasan"
        class="w-full md:w-60" filter />
      <Button @click="exportToXlsx" class="p-button-success">Export XLSX</Button>
      <Button @click="exportToPdf" class="p-button-danger">Export PDF</Button>
    </div>

    <!-- Member List DataTable -->
    <DataTable :value="filteredInvoices" paginator :rows="10" class="p-datatable-sm shadow-md mb-6">
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

    <!-- Infaq Contributions Table -->
    <h1 class="text-2xl font-semibold my-4">Senarai Infaq</h1>
    <DataTable :value="formattedInfaqList" paginator :rows="10" class="p-datatable-sm shadow-md">
      <Column field="namaAhli" header="Nama Ahli" sortable></Column>
      <Column field="noKadPengenalan" header="No Kad Pengenalan"></Column>
      <Column field="amount" header="Jumlah Infaq (RM)" sortable></Column>
      <Column field="kaedahBayaran" header="Kaedah Bayaran"></Column>
      <Column field="tarikh" header="Tarikh Infaq"></Column>
    </DataTable>

    <!-- Home Button -->
    <div class="home-button-container">
      <Button label="Kembali ke Laman Admin" class="p-button-secondary w-full" icon="pi pi-arrow-left"
        @click="navigateToAdminDashboard" />
    </div>
  </div>
</template>


<style scoped>
button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  color: white;
  font-weight: 700;
}

.p-button-success {
  background-color: #28a745;
}

.p-button-danger {
  background-color: #dc3545;
}

.home-button-container {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 450px;
  text-align: center;
}

.p-toast {
  max-width: 400px !important;
  width: auto !important;
}

/* Ensure contrast in both light and dark modes */
.p-button-secondary {
  background-color: var(--button-secondary-bg) !important;
  color: var(--button-secondary-text) !important;
}

.dark-mode .p-button-secondary {
  background-color: #343a40 !important; /* Darker shade for dark mode */
}
</style>
