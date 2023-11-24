<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { MODE } from '@Main'

import Button from '@Components/Button/Button.vue'
import {
  TeamActionButtonsEmits,
  TeamActionButtonsProps,
  modalNames,
} from '@Components/Modals/TeamModal/TeamAction.types'

import useUserStore from '@Store/user/userStore'

defineProps<TeamActionButtonsProps>()

const emits = defineEmits<TeamActionButtonsEmits>()

const { deleteModal } = modalNames
const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isCopied = ref<boolean>(false)

const route = useRoute()

function shareButton(id: string) {
  const link =
    MODE === 'DEVELOPMENT'
      ? `http://localhost:8080${route.fullPath}`
      : `https://hits.tyuiu.ru${route.fullPath}`
  navigator.clipboard.writeText(link + id)
  isCopied.value = true
}
</script>

<template>
  <div class="action-buttons w-100">
    <Button
      v-if="team.owner?.id == user?.id || user?.role == 'ADMIN'"
      variant="primary"
      prepend-icon-name="bi bi-pencil-square"
      @click="router.push(`/teams/update/${team.id}`)"
    >
      Редактировать
    </Button>

    <Button
      @click="shareButton(team?.id)"
      :variant="isCopied ? 'success' : 'primary'"
      prepend-icon-name="bi bi-share-fill"
    >
      {{ isCopied ? 'Ссылка скопирована!' : 'Скопировать ссылку' }}
    </Button>

    <Button
      v-if="team.owner.id == user?.id || user?.role == 'ADMIN'"
      variant="danger"
      prepend-icon-name="bi bi-trash3-fill"
      @click="emits('openModal', team.id, deleteModal)"
    >
      Удалить команду
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.action-buttons {
  @include flexible(stretch, stretch, column, $gap: 8px);
}
</style>
