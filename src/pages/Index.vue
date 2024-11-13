<template>
  <h2>user: {{ user }}</h2>
  <v-btn to="logoff" variant="outlined">Logoff</v-btn>
</template>

<script setup>
import { ref, onMounted } from "vue";

const user = ref(null);

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem("user"));
});
</script>
