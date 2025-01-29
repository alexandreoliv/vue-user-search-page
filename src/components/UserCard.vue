<script setup lang="ts">
import { defineProps, defineEmits, ref, watchEffect } from 'vue'
import type { User } from '../types'

const props = defineProps<{
  userItem: User
}>()

// Create a local reactive copy of userItem
const localUserItem = ref({ ...props.userItem })

// Watch for changes to props.userItem and update the local copy if necessary
watchEffect(() => {
  localUserItem.value = { ...props.userItem }
})

const emit = defineEmits<{
  (event: 'click'): void
  (event: 'favouriteToggle', user: User): void
  (event: 'updateTags', user: User): void
}>()

const onCardClick = () => {
  emit('click')
}

const toggleFavourite = (userItem: User) => {
  userItem.favourite = !userItem.favourite
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
    <img :src="localUserItem.picture.thumbnail" alt="User Thumbnail" />
    <div class="userCardInfo">
      <div class="user-name">
        <p>
          <span class="bold-name">{{ localUserItem.name.first }} {{ localUserItem.name.last }}</span>
          <!-- @click.stop prevents the UserDetails component from opening when clicking the Favourite button -->
          <button
            @click.stop="toggleFavourite(localUserItem)"
            :class="{ favourite: localUserItem.favourite }"
            aria-label="Toggle favourite"
          >
            <span :class="localUserItem.favourite ? 'filled-star' : 'empty-star'">★</span>
          </button>
        </p>
      </div>
      <p class="email">{{ localUserItem.email }}</p>

      <div class="tags-input-container" @click.stop>
        <div
          class="tag"
          v-for="(tag, index) in localUserItem.tags || []"
          :key="'tag' + index"
        >
          <span
            v-if="activeTagIndex !== index"
            @click.stop="activeTagIndex = index"
          >
            {{ tag }}
          </span>
          <input
            maxlength="20"
            v-else
            v-model="localUserItem.tags[index]"
            @blur="editTag(localUserItem, index, localUserItem.tags[index]); activeTagIndex = null"
            @keyup.enter="editTag(localUserItem, index, localUserItem.tags[index]); activeTagIndex = null"
          />
          <button @click.stop="removeTag(localUserItem, index)" class="delete-tag">
            ✕
          </button>
        </div>
        <input
          class="new-tag-input"
          type="text"
          placeholder="Add a tag..."
          maxlength="20"
          @keyup.enter="addTag(localUserItem, ($event.target as HTMLInputElement)?.value || ''); ($event.target as HTMLInputElement).value = ''"
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
  margin-left: 2px;
  margin-right: 10px;
}

.userCardInfo {
  margin-right: 20px;
  width: 80%;
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
  padding-left: 4px;
  transform: translateY(3px);
}

.empty-star {
  color: #ccc;
  padding-left: 4px;
  transform: translateY(3px);
}

.tags-input-container {
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 80%;
}

.tag {
  display: flex;
  align-items: center;
  background: #e0e0e0;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 14px;
  color: #2c3e50;
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
  min-width: 100px;
}

.delete-tag {
  background: none;
  border: none;
  font-size: 14px;
  color: #ff4d4f;
  cursor: pointer;
  margin-left: 4px;
}

.bold-name {
  font-weight: bold;
  color: #2c3e50;
}

.email {
  color: #2c3e50;
}
</style>