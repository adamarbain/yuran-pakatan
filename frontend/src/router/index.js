import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Invoices from "@/views/Invoices.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/invoices",
    name: "Invoices",
    component: Invoices,
  },
  {
    path: "/admin-dashboard",
    name: "AdminDashboard",
    component: AdminDashboard,
  },
  {
    path: "/add-member",
    name: "AddMember",
    component: () => import("@/views/AddMember.vue"),
  },
  {
    path: "/add-invoice",
    name: "AddInvoice",
    component: () => import("@/views/AddInvoice.vue"),
  },
  {
    path: "/view-invoices",
    name: "ViewInvoices",
    component: () => import("@/views/ViewInvoices.vue"),
  },
  {
    path: "/add-infaq",
    name: "AddInfaq",
    component: () => import("@/views/AddInfaq.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
