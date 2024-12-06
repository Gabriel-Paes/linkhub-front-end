<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-card class="px-6 py-8 mx-auto" width="500">
        <div class="logo">
          <img class="logo__img" src="@/assets/linkhub-logo.jpeg" alt="" />
        </div>
        <h1 class="mb-2 text-center">Login</h1>
        <v-form v-model="form" @submit.prevent="onSubmit">
          <v-text-field
            v-model="email"
            :readonly="loading"
            :rules="[required]"
            class="mb-2"
            label="Email"
            clearable
            variant="underlined"
          ></v-text-field>

          <v-text-field
            v-model="password"
            :readonly="loading"
            :rules="[required]"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            label="Password"
            clearable
            variant="underlined"
            @click:append-inner="visible = !visible"
          ></v-text-field>
          <br />

          <v-btn
            :disabled="!form"
            :loading="loading"
            color="success"
            size="large"
            type="submit"
            variant="elevated"
            block
          >
            Login
          </v-btn>
          <v-btn
            color="primary"
            variant="outlined"
            size="large"
            to="/register"
            block
            class="mt-4"
          >
            Register
          </v-btn>
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
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { token } from "@/controllers";

const router = useRouter();

const form = ref(false);
const email = ref(null);
const password = ref(null);
const visible = ref(false);
const loading = ref(false);

// Para exibir mensagens ao usuário
const message = ref(null);
const messageType = ref("error");

const required = (value) => {
  return !!value || "Field is required";
};

const onSubmit = async () => {
  if (!form.value) return;

  loading.value = true;
  message.value = null; // Limpa mensagens anteriores

  try {
    const res = await token({
      email: email.value,
      password: password.value,
    });

    if (res.ok) {
      messageType.value = "success";
      message.value = "Login com sucesso!";
      router.push({ name: "Home" });
    } else {
      messageType.value = "error";
      message.value = "Senha ou email incorretos.";
    }
  } catch (error) {
    console.error(error);
    messageType.value = "error";
    message.value = "Usuário não encontrado.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  text-align: center;
  &__img {
    height: 120px;
    border-radius: 50%;
  }
}
</style>
