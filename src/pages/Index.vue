<template>
  <v-app>
    <!-- Menu Lateral -->
    <v-navigation-drawer 
      app 
      v-model="drawer"
      permanent
    >
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
          <!-- Título das salas -->
          <h1>Salas</h1>
        </v-col>
      </v-row>

   
      <v-row class="justify-end">
        <v-col cols="12" class="text-right">
          <v-btn class="ma-2" color="grey lighten-2" outlined>+ NEW</v-btn>
        </v-col>
      </v-row>

      <!-- Lista de salas -->
      <v-row>
        <v-col cols="12" md="6" v-for="(sala, index) in salas" :key="index">
          <v-card class="pa-3" color="grey lighten-3">
            <v-card-title>{{ sala.nome }}</v-card-title>
            <v-card-subtitle>{{ sala.pessoa }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- abrir o menu lateral -->
    <v-btn 
      @click="toggleDrawer" 
      icon 
      class="fixed-top"
      v-if="!drawer"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const user = ref(null);
const email = ref(null);
const drawer = ref(false);
const router = useRouter();

onMounted(() => {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    user.value = userData.name;
    email.value = userData.email;
  }
});

// Dados das salas
const salas = ref([
  { nome: 'Sala-001', pessoa: 'Ricardo Sousa' },
  { nome: 'Sala-002', pessoa: 'Ricardo Silva' },
]);

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

// Função para realizar o logoff e redirecionar para a tela de login
const logoff = () => {
  // Remove o usuário do localStorage
  localStorage.removeItem("user");

  user.value = null;
  email.value = null;

  // rota de logoff 
  router.push({ name: "Logoff" }).catch(err => console.log(err)); 
};
</script>

<style scoped>
h1 {
  font-weight: bold;
}
.v-card {
  margin-bottom: 16px;
}

.text-center h2 {
  display: none;
}

.fixed-top {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;
}
</style>
