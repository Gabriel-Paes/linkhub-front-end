<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" temporary>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>mdi-account-circle</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ user }}</v-list-item-title>
            <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item @click="logoff">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logoff</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-container>
      <v-row class="text-center">
        <v-col cols="12">
          <h1>Rooms</h1>
        </v-col>
      </v-row>

      <v-row class="align-center">
        <v-col cols="8" md="10">
          <v-text-field
            v-model="filter"
            prepend-inner-icon="mdi-magnify"
            label="Search a room"
            outlined
            clearable
            hide-details
            single-line
            variant="solo-filled"
          ></v-text-field>
        </v-col>
        <v-col cols="4" md="2" class="text-right">
          <v-btn class="ma-2" color="primary">+ NEW</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4" v-for="(sala, i) in filteredSalas" :key="i">
          <v-card class="pa-3">
            <v-card-title>{{ sala.nome }}</v-card-title>
            <v-card-subtitle>{{ sala.pessoa }}</v-card-subtitle>
            <v-card-actions>
              <v-divider></v-divider>
              <v-spacer></v-spacer>
              <v-btn color="success" variant="flat">Join</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-btn @click="toggleDrawer" icon class="fixed-top" v-if="!drawer">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const user = ref(null);
const email = ref(null);
const drawer = ref(false);
const router = useRouter();

const salas = ref([
  { nome: "Sala-001", pessoa: "Ricardo Sousa" },
  { nome: "Sala-002", pessoa: "Ricardo Silva" },
  { nome: "Sala-003", pessoa: "Ricardo Amado" },
]);
const filter = ref("");

const filteredSalas = computed(() => {
  if (!filter.value) return salas.value;
  const lowerFilter = filter.value.toLowerCase();
  return salas.value.filter(
    (sala) =>
      sala.nome.toLowerCase().includes(lowerFilter) ||
      sala.pessoa.toLowerCase().includes(lowerFilter)
  );
});

onMounted(() => {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    user.value = userData.name;
    email.value = userData.email;
  }
});

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const logoff = () => {
  router.push({ name: "Logoff" });
};
</script>

<style scoped>
h1 {
  font-weight: bold;
}
.v-card {
  margin-bottom: 16px;
}

.fixed-top {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;
}
</style>
