<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-card class="px-6 py-8" width="500">
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
          ></v-text-field>

          <v-text-field
            v-model="password"
            :readonly="loading"
            :rules="[required]"
            label="Password"
            type="password"
            placeholder="Enter your password"
            clearable
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
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    form: false,
    email: null,
    password: null,
    loading: false,
  }),

  methods: {
    onSubmit() {
      if (!this.form) return;

      this.loading = true;

      setTimeout(() => (this.loading = false), 2000);
    },
    required(v) {
      return !!v || "Field is required";
    },
  },
};
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  text-align: center;
  &__img {
    height: 140px;
    border-radius: 50%;
  }
}
</style>
