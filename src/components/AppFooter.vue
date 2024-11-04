<template>
  <v-footer height="40" app>
    <span class="text-caption text-disabled">Version: {{ version }}</span>
    <div
      class="text-caption text-disabled"
      style="position: absolute; right: 16px"
    >
      &copy; {{ new Date().getFullYear() }}
      <span class="d-none d-sm-inline-block">Todos os direitos reservados</span>
      —
      <a
        class="text-decoration-none on-surface"
        href=""
        rel="noopener noreferrer"
        target="_blank"
      >
        LinkHub
      </a>
    </div>
  </v-footer>
</template>

<script setup>
import { version } from "../../package.json";
</script>

<style scoped lang="sass">
.social-link :deep(.v-icon)
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
  text-decoration: none
  transition: .2s ease-in-out

  &:hover
    color: rgba(25, 118, 210, 1)
</style>
