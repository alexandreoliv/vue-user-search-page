<script setup lang="ts">
import { defineProps } from 'vue'

interface User {
  name: {
    first: string
    last: string
  }
  picture: {
    large: string
  }
  login: {
    uuid: string
  }
  location: {
    city: string
    state: string
    country: string
  }
  email: string
  phone: string
}

defineProps<{
  selectedUser: User | null
}>()
</script>

<template>
  <div v-if="selectedUser" class="user-details">
    <h3>User Details</h3>
    <img :src="selectedUser.picture.large" alt="User Picture" />
    <p>{{ selectedUser.name.first }} {{ selectedUser.name.last }}</p>
    <p><strong>ID:</strong> {{ selectedUser.login.uuid }}</p>
    <p>
      <strong>Location:</strong> {{ selectedUser.location.city }},
      {{ selectedUser.location.state }},
      {{ selectedUser.location.country }}
    </p>
    <p>
      <strong>Contact:</strong> {{ selectedUser.email }} |
      {{ selectedUser.phone }}
    </p>
  </div>
</template>

<style scoped>
.user-details {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  max-width: 400px;
  background-color: #f9f9f9;
}

.user-details img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
