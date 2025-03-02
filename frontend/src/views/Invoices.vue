<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const invoices = ref([]);
const yearRange = ref([]);

onMounted(async () => {
  const userId = localStorage.getItem("userId"); // ✅ Get stored user ID
  if (!userId) {
    console.error("User ID not found. Redirect to login.");
    return;
  }

  try {
    const response = await axios.get(`http://localhost:5000/api/invoices/${userId}`);
    invoices.value = response.data;

    // ✅ Dynamically get available years from the first record
    if (invoices.value.length > 0) {
      const firstUser = invoices.value[0];
      yearRange.value = Object.keys(firstUser)
        .filter((key) => key.startsWith("yuran")) // Only take yuran keys
        .map((key) => key.replace("yuran", "")); // Remove "yuran" prefix to get year
    }

    console.log("Invoices:", invoices.value);
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }
});

// ✅ Print invoice function
const printInvoice = async (user, year) => {
  const amount = user[`yuran${year}`];
  if (amount > 0) {
    try {
      // Create invoice data
      const invoiceData = {
        namaAhli: user.namaAhli,
        noAhli: user.noAhli,
        alamat: user.alamat,
        tarikh: new Date().toLocaleDateString('ms-MY'),
        jumlah: amount,
        tahun: year
      };

      // Make API call to generate PDF
      const response = await axios.post(
        'http://localhost:5000/api/invoices/generate-invoice',
        invoiceData,
        { responseType: 'blob' }
      );

      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RESIT_YURAN_PAKATAN-${user.namaAhli}-${year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice PDF');
    }
  } else {
    alert(`No payment recorded for ${user.namaAhli} in ${year}.`);
  }
};
</script>

<template>
  <div>
    <h1>Invoice History</h1>
    <table v-if="invoices.length > 0" border="1">
      <thead>
        <tr>
          <th>Name</th>
          <th>No Ahli</th>
          <th>No Tel</th>
          <th>Alamat</th>
          <th>Kawasan</th>
          <th v-for="year in yearRange" :key="year">Year {{ year }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in invoices" :key="user.id">
          <td>{{ user.namaAhli }}</td>
          <td>{{ user.noAhli }}</td>
          <td>{{ user.noTel }}</td>
          <td>{{ user.alamat }}</td>
          <td>{{ user.kawasan }}</td>
          <td v-for="year in yearRange" :key="year">
            RM{{ user[`yuran${year}`] }}
            <button v-if="user[`yuran${year}`] > 0" @click="printInvoice(user, year)">Print Invoice</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No invoices found.</p>
  </div>
</template>
