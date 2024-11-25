<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" temporary>
      <v-list>
        <v-list-item>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item @click="logoff">
          <v-icon>mdi-logout</v-icon>
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
          <v-dialog max-width="500" persistent>
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" class="ma-2" color="primary">
                + NEW
              </v-btn>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="New Room">
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.name"
                        class="mb-2"
                        label="Name"
                        clearable
                        variant="underlined"
                      ></v-text-field>
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
                    :loading="isLoading.createRoom"
                    @click="createRoom()"
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
          v-if="!isLoading.rooms"
          v-for="(room, i) in filteredRooms"
          :key="i"
        >
          <v-card class="pa-3">
            <v-card-title>{{ room.name }}</v-card-title>
            <v-card-subtitle>{{ room.user_id }}</v-card-subtitle>
            <v-card-actions>
              <v-divider></v-divider>
              <v-spacer></v-spacer>
              <v-btn color="success" variant="flat" @click="goToRoom(room.id)">
                Join
              </v-btn>
            </v-card-actions>
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
import { useRouter } from "vue-router";
import { getRoom, postRoom } from "@/controllers";

const drawer = ref(false);
const router = useRouter();
const isLoading = reactive({
  rooms: true,
  createRoom: false,
});
const form = reactive({
  name: "",
});
const rooms = ref([]);

const filter = ref("");

const filteredRooms = computed(() => {
  if (!filter.value) return rooms.value;
  const lowerFilter = filter.value.toLowerCase();
  return rooms.value.filter(
    (room) =>
      room.name.toLowerCase().includes(lowerFilter) ||
      room.id.toLowerCase().includes(lowerFilter)
  );
});

const getRooms = async () => {
  try {
    isLoading.rooms = true;
    const { data } = await getRoom();

    rooms.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.rooms = false;
  }
};

onMounted(async () => {
  await getRooms();
});

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const goToRoom = (roomId) => {
  router.push({ name: "Room", params: { roomId: roomId } });
};

const logoff = () => {
  router.push({ name: "Logoff" });
};

const createRoom = async () => {
  if (!form.name.trim().length) return;

  try {
    isLoading.createRoom = true;
    const res = await postRoom({
      name: form.name,
    });

    if (res) {
      await getRooms();
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.createRoom = false;
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
