<template>
  <v-container class="fill-height">
    <v-card class="px-6 py-8 mx-auto" width="500">
      <h1 class="mb-2 text-center">Registration</h1>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-container>
          <v-text-field
            v-model="name"
            color="primary"
            label="Name"
            variant="underlined"
            :rules="[required]"
          ></v-text-field>

          <v-text-field
            v-model="username"
            color="primary"
            label="Username"
            variant="underlined"
            :rules="[required]"
          ></v-text-field>

          <v-text-field
            v-model="email"
            color="primary"
            label="Email"
            variant="underlined"
            :rules="[required, emailRule]"
          ></v-text-field>

          <v-text-field
            v-model="password"
            :readonly="loading"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            color="primary"
            label="Password"
            clearable
            variant="underlined"
            @click:append-inner="visible = !visible"
            :rules="[required, passwordRule]"
          ></v-text-field>

          <v-card-actions>
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-arrow-left"
              to="Login"
            >
              Go back
            </v-btn>
            <v-spacer></v-spacer>

            <v-btn
              color="success"
              :disabled="!form"
              :loading="loading"
              type="submit"
              variant="flat"
            >
              Complete Registration

              <v-icon icon="mdi-chevron-right" end></v-icon>
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-form>

      <v-alert
        v-if="message"
        :type="messageType"
        class="mt-4"
        dismissible
      >
        {{ message }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "@/controllers";

const router = useRouter();

const form = ref(false);
const name = ref(null);
const username = ref(null);
const email = ref(null);
const password = ref(null);
const visible = ref(false);
const loading = ref(false);

// Para exibir mensagens ao usuário
const message = ref(null);
const messageType = ref("error");

// Regras de validação
const required = (value) => !!value || "Field is required";

const emailRule = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) || "Enter a valid email";
};

const passwordRule = (value) => {
  return value?.length >= 8 || "A senha precisa conter no mínimo 8 caracteres.";
};

const onSubmit = async () => {
  if (!form.value) return;

  loading.value = true;
  message.value = null; // Limpa mensagens anteriores

  try {
    const res = await register({
      name: name.value,
      username: username.value,
      email: email.value,
      password: password.value,
    });

    if (res.ok) {
      // Registro bem-sucedido
      messageType.value = "success";
      message.value = "Registro feito com sucesso!";
      router.push({ name: "Login" });
    } else if (res.status === 409) {
      // Erro de conflito (e-mail já registrado)
      const errorData = await res.json();
      messageType.value = "error";
      message.value = errorData.message || "O e-mail já está em uso. Tente outro.";
    } else {
      // Outros erros
      const errorData = await res.json();
      messageType.value = "error";
      message.value = errorData.message || "Ocorreu um erro. Tente novamente.";
    }
  } catch (error) {
    console.error("Erro ao se comunicar com o servidor:", error);
    messageType.value = "error";
    message.value = "Erro ao se comunicar com o servidor.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.fill-height {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
