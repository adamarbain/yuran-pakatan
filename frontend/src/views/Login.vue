<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const icNumber = ref("");
const username = ref("");
const password = ref("");
const userType = ref("user");

const userOptions = [
  { label: "Ahli Biasa", value: "user" },
  { label: "Admin", value: "admin" },
];

const login = async () => {
  try {
    if (userType.value === "user") {
      const response = await axios.post(`${API_BASE_URL}/api/auth/user-login`, {
        icNumber: icNumber.value,
      });
      localStorage.setItem("userId", icNumber.value);
      toast.add({
        severity: "success",
        summary: "Log Masuk Berjaya",
        detail: "Sila Tunggu Sebentar...",
        life: 2000,
      });
      setTimeout(() => router.push("/invoices"), 1500);
    } else if (userType.value === "admin") {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/admin-login`,
        {
          username: username.value,
          password: password.value,
        }
      );
      localStorage.setItem("token", response.data.token);
      toast.add({
        severity: "success",
        summary: "Log Masuk Berjaya",
        detail: "Sila Tunggu Sebentar...",
        life: 2000,
      });
      setTimeout(() => router.push("/admin-dashboard"), 1500);
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Log Masuk Gagal",
      detail: "Periksa No Kad Pengenalan",
      life: 3000,
    });
  }
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-4">
    <div class="flex flex-column gap-4 w-full max-w-4xl">
      <!-- Login Card -->
      <div class="surface-card p-5 shadow-2 border-round w-full max-w-md mx-auto">
        <h2 class="text-center mb-4">
          Persatuan Kebajikan Am Taman Meru (PAKATAN)
        </h2>

        <p class="text-center mb-4">
          Sila Masukkan No Kad Pengenalan untuk Memeriksa Status Yuran Tahunan
        </p>

        <!-- Toast with pt prop -->
        <Toast position="top-right" />

        <div class="mb-4">
          <label class="block mb-2">Jenis Pengguna</label>
          <Dropdown
            v-model="userType"
            :options="userOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>

        <div v-if="userType === 'user'" class="mb-4">
          <label class="block mb-2">No Kad Pengenalan</label>
          <InputText
            v-model="icNumber"
            class="w-full p-inputtext-lg"
            placeholder="e.g. 0123456-08-0012"
          />
          <small class="text-gray-500">
            *Sila Masukkan No Kad Pengenalan Termasuk Simbol (-)
          </small>
        </div>

        <div v-else>
          <div class="mb-4">
            <label class="block mb-2">Admin Username</label>
            <InputText
              v-model="username"
              class="w-full p-inputtext-lg"
              placeholder="Enter Username"
            />
          </div>
          <div class="mb-4">
            <label class="block mb-2">Admin Password</label>
            <Password
              v-model="password"
              class="w-full"
              toggleMask
              :feedback="false"
              placeholder="Enter Password"
            />
          </div>
        </div>

        <Button
          label="Log Masuk"
          raised
          icon="pi pi-sign-in"
          :loading="loading"
          class="w-full p-button-lg font-bold"
          @click="login"
        />
      </div>

      <!-- Payment Method Card -->
      <div class="surface-card p-5 shadow-2 border-round w-full max-w-md mx-auto">
        <h3 class="text-center mb-4">Kaedah Pembayaran</h3>
        
        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <div class="payment-card p-3 border-round">
              <div class="flex align-items-center mb-2">
                <i class="pi pi-wallet mr-2 text-xl"></i>
                <h4 class="m-0">Tunai</h4>
              </div>
              <p class="m-0 text-sm">
                Pembayaran secara tunai kepada AJK PAKATAN.
              </p>
            </div>
          </div>
          
          <div class="col-12 md:col-6 mb-3">
            <div class="payment-card p-3 border-round">
              <div class="flex align-items-center mb-2">
                <i class="pi pi-credit-card mr-2 text-xl"></i>
                <h4 class="m-0">CDM</h4>
              </div>
              <p class="m-0 text-sm">
                Pembayaran menggunakan deposit tunai di kaunter CDM.
              </p>
              <p class="m-0 text-sm">
                Bank Islam 0123456789
              </p>
            </div>
          </div>
          
          <div class="col-12 md:col-6 mb-3">
            <div class="payment-card p-3 border-round">
              <div class="flex align-items-center mb-2">
                <i class="pi pi-building-columns mr-2 text-xl"></i>
                <h4 class="m-0">Bank Transfer</h4>
              </div>
              <p class="m-0 text-sm">
                Pemindahan ke akaun PAKATAN: Bank Islam 0123456789
              </p>
            </div>
          </div>
          
          <div class="col-12 md:col-6 mb-3">
            <div class="payment-card p-3 border-round">
              <div class="flex align-items-center mb-2">
                <i class="pi pi-qrcode mr-2 text-xl"></i>
                <h4 class="m-0">QR Code</h4>
              </div>
              <p class="m-0 text-sm">
                Pembayaran menggunakan kod QR PAKATAN.
              </p>
            </div>
          </div>

            <div class="col-12 md:col-6 mb-3">
            <div class="payment-card p-3 border-round">
              <div class="flex align-items-center mb-2">
              <i class="pi pi-phone mr-2 text-xl"></i>
              <h4 class="m-0">Talian Bantuan</h4>
              </div>
              <p class="m-0 text-sm">
              Sebarang pertanyaan sila hubungi:
              </p>
              <p class="m-0 text-sm">
              010-458 7140 (En. Arbain)
              </p>
            </div>
            </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style>
* {
  font-family: "inter", sans-serif;
}

.p-toast {
  max-width: 400px !important;
  width: auto !important;
}

/* Custom payment card styling that works in both light and dark mode */
.payment-card {
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
  height: 100%;
}

.payment-card:hover {
  border-color: var(--color-border-hover);
  background-color: var(--color-background-soft);
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

/* Ensure text is always visible in both themes */
.payment-card h4 {
  color: var(--color-heading);
}

.payment-card p {
  color: var(--color-text);
}

.payment-card i {
  color: hsla(160, 100%, 37%, 1);
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .col-12 {
    padding: 0.5rem;
  }
}

@media (min-width: 1024px) {
  #app {
    display: block !important;
  }
}
</style>
