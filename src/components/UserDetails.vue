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
  favourite: boolean
  tags?: string[]
}

defineProps<{
  selectedUser: User | null
}>()
</script>

<template>
  <div v-if="selectedUser" class="user-card">
    <div class="user-card_popup">
      <div class="user-card_avatar_bokeh">
        <img :src="selectedUser.picture.large" alt="user-avatar" />
      </div>
      <div class="user-card_avatar">
        <img :src="selectedUser.picture.large" class="user-card_avatar_border" alt="user-avatar" />
      </div>
      <div class="user-card_content">
        <h1>{{ selectedUser.name.first }} {{ selectedUser.name.last }}<!--<span v-if="selectedUser.favourite" style="color: gold;">★</span>--></h1>
        <p class="user-card_id">🆔 {{ selectedUser.login.uuid }}</p>
        <p class="user-card_location">📍 {{ selectedUser.location.city }}, {{ selectedUser.location.country }}</p>
        <a :href="'mailto:' + selectedUser.email" class="user-card_email">✉️ {{ selectedUser.email }}</a>
        <p class="user-card_phone">📞 {{ selectedUser.phone }}</p>
        <div class="user-tags">
          <ul>
            <li v-for="(tag, index) in selectedUser.tags || []" :key="index">
              {{ tag }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  cursor: pointer;
  max-width: 300px;
}

.user-card_avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.user-card_avatar img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
  transition: transform 0.3s;
  transform: translateY(-50px); /* Moves the image upwards */
}

.user-card_avatar_border {
  border: 3px solid gold;
  transform: scale(1.1);
}

.user-card_popup {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  width: 350px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s, transform 0.3s;
}

.user-card_avatar_bokeh {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100px;
}

.user-card_avatar_bokeh img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(10px);
}

.user-card_content {
  padding: 0 15px 15px 15px;
  text-align: center;
  margin-top: -20px;
}

.user-card h1 {
  font-size: 18px;
  margin: 0;
}

.user-card_id {
  color: #666;
  font-size: 14px;
  margin-top: 20px;
}

.user-card_location {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
}

.user-card_email {
  color: #0073e6;
  font-size: 14px;
  text-decoration: none;
}

.user-card_email:hover {
  text-decoration: underline;
}

.user-card_phone {
  font-size: 14px;
  color: #333;
  margin-top: 10px;
}

.user-tags {
  margin-top: 20px;
}

.user-tags ul {
  list-style-type: none;
  padding-left: 0;
}

.user-tags li {
  display: inline-block;
  background-color: #f0f0f0;
  margin-right: 8px;
  padding: 5px 10px;
  border-radius: 16px;
}
</style>
