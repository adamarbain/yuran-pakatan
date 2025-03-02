<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

</script>


<template>
    <div>
      <h1>Admin Dashboard</h1>
      <button @click="$router.push('/add-member')">Add New Member</button>
      <button @click="$router.push('/add-invoice')">Add Invoice for Member</button>
      <button @click="$router.push('/view-invoices')">View All Invoices</button>
    </div>
  </template>
  