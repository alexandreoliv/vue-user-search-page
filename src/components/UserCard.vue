<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'

interface User {
  picture: {
    thumbnail: string
  }
  name: {
    first: string
    last: string
  }
  email: string
  favourite: boolean
  tags?: string[]
}

defineProps<{
  userItem: User
}>()

const emit = defineEmits<{
  (event: 'click'): void
  (event: 'favouriteToggle', user: User): void
  (event: 'updateTags', user: User): void
}>()

const onCardClick = () => {
  emit('click')
}

const toggleFavourite = (userItem: User) => {
  emit('favouriteToggle', userItem)
}

const activeTagIndex = ref<number | null>(null)

const addTag = (userItem: User, tagValue: string) => {
  if (!userItem.tags) userItem.tags = []
  if (tagValue.trim() && !userItem.tags.includes(tagValue)) {
    userItem.tags.push(tagValue.trim())
    emit('updateTags', userItem)
  }
}

const removeTag = (userItem: User, index: number) => {
  if (userItem.tags) {
    userItem.tags.splice(index, 1)
    emit('updateTags', userItem)
  }
}

const editTag = (userItem: User, index: number, newValue: string) => {
  if (userItem.tags) {
    userItem.tags[index] = newValue.trim()
    emit('updateTags', userItem)
  }
}
</script>

<template>
  <div class="UserCard" @click="onCardClick">
    <img :src="userItem.picture.thumbnail" alt="User Thumbnail" />
    <div class="userCardInfo">
      <div class="user-name">
        <p>
          <span>{{ userItem.name.first }} {{ userItem.name.last }}</span>
          <!-- @click.stop prevents the UserDetails component from opening when clicking the Favourite button -->
          <button
            @click.stop="toggleFavourite(userItem)"
            :class="{ favourite: userItem.favourite }"
            aria-label="Toggle favourite"
          >
            <span :class="userItem.favourite ? 'filled-star' : 'empty-star'">★</span>
          </button>
        </p>
      </div>
      <p class="email">{{ userItem.email }}</p>

      <div class="tags-input-container">
        <div
          class="tag"
          v-for="(tag, index) in userItem.tags || []"
          :key="'tag' + index"
        >
          <span
            v-if="activeTagIndex !== index"
            @click.stop="activeTagIndex = index"
          >
            {{ tag }}
          </span>
          <input
            v-else
            v-model="userItem.tags[index]"
            @blur="editTag(userItem, index, userItem.tags[index]); activeTagIndex = null"
            @keyup.enter="editTag(userItem, index, userItem.tags[index]); activeTagIndex = null"
          />
          <button @click.stop="removeTag(userItem, index)" class="delete-tag">
            ✕
          </button>
        </div>
        <input
          class="new-tag-input"
          type="text"
          placeholder="Add a tag..."
          @keyup.enter="addTag(userItem, $event.target.value); $event.target.value = ''"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.UserCard {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.UserCard:hover {
  background-color: #f0f0f0;
}

.UserCard img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

button {
  background: none;
  border: none;
  padding: 0;
  font-size: 24px;
  cursor: pointer;
  display: inline;
  color: inherit;
}

button span {
  display: inline-block;
}

.filled-star {
  color: gold;
}

.empty-star {
  color: #ccc;
}

.tags-input-container {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: flex;
  align-items: center;
  background: #e0e0e0;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 14px;
}

.tag input {
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.new-tag-input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  font-size: 14px;
  flex: 1;
}

.delete-tag {
  background: none;
  border: none;
  font-size: 14px;
  color: #ff4d4f;
  cursor: pointer;
}
</style>
