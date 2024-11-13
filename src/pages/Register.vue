<template>
  <v-container class="fill-height">
    <v-card class="px-6 py-8 mx-auto" width="500" title="Registration">
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
            color="primary"
            label="Password"
            placeholder="Enter your password"
            variant="underlined"
          ></v-text-field>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="success"
              :disabled="!form"
              :loading="loading"
              type="submit"
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

<script>
import { useRouter } from "vue-router";

const router = useRouter();

export default {
  data: () => ({
    form: false,
    name: null,
    username: null,
    email: null,
    password: null,
    loading: false,
  }),

  methods: {
    onSubmit() {
      if (!this.form) return;

      this.loading = true;

      const body = {
        name: this.name,
        username: this.username,
        email: this.email,
        password: this.password,
      };

      setTimeout(() => {
        this.loading = false;
        router.push({ name: "Login" });
      }, 2000);
    },
    required(v) {
      return !!v || "Field is required";
    },
  },
};
</script>
