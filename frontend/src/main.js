import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Import the router
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

// Import PrimeVue Components
import Toast from 'primevue/toast';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

import Aura from '@primeuix/themes/aura';

// import "primevue/resources/themes/lara/lara-light-blue/theme.css";  // Theme
// import "primevue/resources/primevue.min.css";  // Core styles
import "primeicons/primeicons.css";  // Icons
import "primeflex/primeflex.css";  // Flex utilities


const app = createApp(App);
app.use(router); // Use the router
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService); // ✅ Register ToastService globally

// Register Components Globally
app.component('Toast', Toast);
app.component('Dropdown', Dropdown);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Button', Button);

app.mount("#app");