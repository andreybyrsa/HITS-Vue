<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import useUserStore from '@Store/user/userStore'

import Button from '@Components/Button/Button.vue'
import {
  TeamActionButtonsEmits,
  TeamActionButtonsProps,
  modalNames,
} from '@Components/Modals/TeamModal/TeamAction.types'

defineProps<TeamActionButtonsProps>()

const emits = defineEmits<TeamActionButtonsEmits>()

const { deleteModal } = modalNames
const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const disabled = ref<boolean>(false)

function shareButton(id: string) {
  navigator.clipboard.writeText('http://localhost:8080/team/' + id)
  disabled.value = true
}
</script>
<template>
  <Button
    v-if="team.owner?.id == user?.id || user?.role == 'ADMIN'"
    class-name="bi bi-pencil-square btn-primary w-100"
    @click="router.push(`/teams/update/${team.id}`)"
    >Редактировать</Button
  >
  <Button
    class-name="bi bi-share-fill btn-primary w-100"
    @click="shareButton(team?.id)"
    :disabled="disabled"
    >{{ disabled ? 'Ссылка скопирована!' : 'Скопировать ссылку' }}</Button
  >
  <Button
    v-if="team.owner.id == user?.id || user?.role == 'ADMIN'"
    class-name="bi bi-trash3-fill btn-danger w-100"
    @click="emits('openModal', team.id, deleteModal)"
    >Удалить команду</Button
  >
</template>
