<template>
  <v-app>
    <v-navigation-drawer v-if="showActions" app v-model="drawer">
      <v-list>
        <v-list-item to="/">
          <v-icon>mdi-account-group</v-icon>
          <v-list-item-title>Rooms</v-list-item-title>
        </v-list-item>
        <v-list-item to="/logoff">
          <v-icon>mdi-logout</v-icon>
          <v-list-item-title>Logoff</v-list-item-title>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="drawer = false" block variant="tonal" color="error">
            Close <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-fab
      v-if="showActions && !drawer"
      icon="mdi-menu"
      class="mb-10"
      location="top start"
      app
      appear
      @click="drawer = true"
    ></v-fab>

    <v-main>
      <RouterView :links="links" />
    </v-main>

    <v-fab
      v-if="showActions"
      color="primary"
      icon="mdi-link"
      class="mb-10"
      location="bottom end"
      app
      appear
      @click="dialog = true"
    ></v-fab>

    <v-dialog
      v-if="showActions"
      v-model="dialog"
      persistent
      max-width="500"
      transition="v-scale-transition"
    >
      <v-card>
        <v-card-title>Gerenciar Links</v-card-title>
        <v-divider />
        <v-card-text>
          <div v-for="(link, i) in links" :key="i">
            <v-text-field
              v-model="link.url"
              label="Link"
              clearable
              variant="underlined"
              placeholder="Insira o link"
              density="compact"
            >
              <template v-slot:append-inner>
                <v-btn
                  v-if="!link.id"
                  icon
                  size="30"
                  color="primary"
                  variant="outlined"
                  @click="createLink(link)"
                  :loading="link.sync"
                >
                  <v-icon size="x-small" :loading="link.sync">mdi-sync</v-icon>
                </v-btn>
              </template>
              <template v-slot:append>
                <v-btn
                  icon
                  color="error"
                  variant="tonal"
                  size="x-small"
                  @click="removeLink(link, i)"
                >
                  <v-icon :loading="link.delete">mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false" variant="tonal" color="error">
            Close <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="outlined" @click="addLink()">
            Adicionar Link
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { RouterView } from "vue-router";
import AppFooter from "@/components/AppFooter.vue";
import { ref, reactive, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { getLink, postLink, deleteLink } from "@/controllers";

const route = useRoute();
const showActions = computed(() => route.meta.requiresAuth === true);

const drawer = ref(false);
const dialog = ref(false);
const links = ref([]);

const isLoading = reactive({
  links: false,
  syncLink: false,
});

const addLink = () => {
  links.value.push({ url: "", id: "" });
};

const getLinks = async () => {
  try {
    isLoading.links = true;
    const { data } = await getLink();
    links.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.links = false;
  }
};

const createLink = async (link) => {
  if (!link.url.trim()) return;

  try {
    link.sync = true;
    const { id } = await postLink({
      url: link.url,
    });
    link.id = id;
  } catch (error) {
    console.error(error);
  } finally {
    link.sync = false;
  }
};

const removeLink = async (link, i) => {
  try {
    link.delete = true;
    if (link.id) {
      await deleteLink(link.id);
    }

    if (i >= 0 && i < links.value.length) {
      links.value.splice(i, 1);
    }
  } catch (error) {
    console.error(error);
  } finally {
    link.delete = false;
  }
};

watch(showActions, async (newValue) => {
  if (newValue) {
    await getLinks();
  }
});
</script>
