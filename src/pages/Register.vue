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
          ></v-text-field>

          <v-text-field
            v-model="username"
            color="primary"
            label="Username"
            variant="underlined"
          ></v-text-field>

          <v-text-field
            v-model="email"
            color="primary"
            label="Email"
            variant="underlined"
          ></v-text-field>

          <v-text-field
            v-model="password"
            :readonly="loading"
            :rules="[required]"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            color="primary"
            label="Password"
            clearable
            variant="underlined"
            @click:append-inner="visible = !visible"
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

const required = (value) => {
  return !!value || "Field is required";
};

const onSubmit = async () => {
  if (!form.value) return;

  loading.value = true;

  try {
    await register({
      name: name.value,
      username: username.value,
      email: email.value,
      password: password.value,
    });

    router.push({ name: "Login" });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
