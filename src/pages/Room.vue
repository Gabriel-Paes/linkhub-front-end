<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" temporary>
      <v-list>
        <v-list-item>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item @click="dialog = true">
          <v-icon>mdi-link</v-icon>
          <v-list-item-title>Gerenciar Links</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item @click="logoff">
          <v-icon>mdi-logout</v-icon>
          <v-list-item-title>Logoff</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-container>
      <v-dialog v-model="dialog" max-width="600">
        <v-card>
          <v-card-title>
            Gerenciar Links
            <v-spacer></v-spacer>
          </v-card-title>

          <v-card-text>
            <v-row dense>
              <!-- Iteração sobre o array de links -->
              <v-col cols="12" v-for="(link, i) in links.links" :key="i">
                <v-text-field
                  v-model="link.url"
                  label="Link"
                  clearable
                  variant="underlined"
                  placeholder="Insira o link"
                ></v-text-field>
                <v-btn color="primary" icon @click="addLink(i)">
                  <v-icon>mdi-link</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn color="error" @click="dialog = false"> Close </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="outlined" @click="maislink()">
              Adicionar Link
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-row class="text-center">
        <v-col cols="12">
          <h1>Room</h1>
        </v-col>
      </v-row>

      <v-row class="align-center">
        <v-col cols="8" md="10">
          <v-text-field
            v-model="filter"
            prepend-inner-icon="mdi-magnify"
            label="Search a post"
            outlined
            clearable
            hide-details
            single-line
            variant="solo-filled"
          ></v-text-field>
        </v-col>
        <v-col cols="4" md="2" class="text-right">
          <v-dialog max-width="500" persistent>
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" class="ma-2" color="primary">
                + NEW
              </v-btn>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="New Post">
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.title"
                        class="mb-2"
                        label="Title"
                        clearable
                        variant="underlined"
                      ></v-text-field>
                      <v-textarea
                        v-model="form.body"
                        class="mb-2"
                        label="Body"
                        clearable
                        variant="underlined"
                      ></v-textarea>
                      <h3>Links</h3>
                      <v-combobox
                        :items="links"
                        v-model="selectedLinks"
                        label="Selecione um link"
                        item-title="url"
                        item-value="id"
                        variant="underlined"
                        multiple
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    text="Close"
                    color="error"
                    @click="isActive.value = false"
                  ></v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    text="Create"
                    color="success"
                    :loading="isLoading.createPost"
                    @click="createPost()"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          md="4"
          v-if="!isLoading.posts"
          v-for="(post, i) in filteredPosts"
          :key="i"
        >
          <v-card class="pa-3">
            <v-card-title>{{ post.title }}</v-card-title>
            <v-card-subtitle>{{ post.body }}</v-card-subtitle>
            <v-divider></v-divider>
            <v-list>
              <v-list-item
                v-for="(id, j) in post.links"
                :key="j"
                :href="getLinkById(id)"
                target="_blank"
              >
                <v-list-item-title>{{ getLinkById(id) }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" v-else v-for="n in 6">
          <v-skeleton-loader :elevation="1" type="card"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>

    <v-btn @click="toggleDrawer" icon class="fixed-top" v-if="!drawer">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getPost, postPost, getLink, postLink } from "@/controllers";

const props = defineProps({
  links: {
    type: Array,
    default: () => [],
  },
});

const getLinkById = (id) => {
  const link = props.links.find((link) => link.id === id);
  return link ? link.url : null;
};

const selectedLinks = ref([]);

const drawer = ref(false);
const dialog = ref(false);
const router = useRouter();
const route = useRoute();
const isLoading = reactive({
  posts: true,
  createPost: false,
  links: false,
});

const form = reactive({
  title: "",
  body: "",
  room_id: "",
  links: [],
});

/* const links = reactive({
  links: [{ url: "" }],
}); */

const posts = ref([]);

const roomId = ref("");
roomId.value = route.params.roomId;

const filter = ref("");

const filteredPosts = computed(() => {
  if (!filter.value) return posts.value;
  const lowerFilter = filter.value.toLowerCase();
  return posts.value.filter((post) =>
    post.title.toLowerCase().includes(lowerFilter)
  );
});

const getPosts = async () => {
  try {
    isLoading.posts = true;
    const { data } = await getPost(roomId.value);

    posts.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.posts = false;
  }
};

const getLinks = async () => {
  try {
    isLoading.links = true;
    const { data } = await getLink();
    links.links = data;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.links = false;
  }
};

onMounted(async () => {
  await getPosts();
  await getLinks();
});

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const logoff = () => {
  router.push({ name: "Logoff" });
};

const maislink = () => {
  links.links.push({ url: "" });
};

const addLink = async (i) => {
  if (!links.links[i].trim().length) return;

  try {
    isLoading.createPost = true;
    await postLink({
      url: links.links[i],
    });
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.createPost = false;
  }
};

const createPost = async () => {
  if (!form.title.trim().length) return;

  try {
    isLoading.createPost = true;

    const linksIds = selectedLinks.value.map((link) => link.id);

    const res = await postPost({
      title: form.title,
      body: form.body,
      room_id: roomId.value,
      links: linksIds,
    });

    if (res) {
      await getPosts();
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.createPost = false;
  }
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
