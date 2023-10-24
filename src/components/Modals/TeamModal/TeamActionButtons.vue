<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import useUserStore from '@Store/user/userStore'

import Button from '@Components/Button/Button.vue'
import { TeamActionButtons } from '@Components/Modals/TeamModal/TeamAction.types'

const props = defineProps<TeamActionButtons>()

defineModel({})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>
<template>
  <Button
    v-if="team.leader.email == user?.email"
    class-name="bi bi-pencil-square btn-primary w-100"
    >Редактировать</Button
  >
  <Button
    v-if="team.leader.email == user?.email || team.owner.email == user?.email"
    class-name="bi bi-envelope-plus-fill btn-primary w-100"
    >Пригласить в команду</Button
  >
  <Button
    v-if="
      team.leader.email != user?.email &&
      team.owner.email != user?.email &&
      !team.members.find((member) => member.email == user?.email)
    "
    class-name="bi bi-card-text btn-primary w-100"
    >Подать заявку на вступление</Button
  >
  <Button
    v-if="team.leader.email == user?.email || team.owner.email == user?.email"
    class-name="bi bi-card-checklist btn-primary w-100"
    >Раcсмотреть заявки</Button
  >
  <Button class-name="bi bi-share-fill btn-primary w-100">Скопировать ссылку</Button>
  <Button
    v-if="team.owner.email == user?.email"
    class-name="bi bi-trash3-fill btn-danger w-100"
    >Удалить команду</Button
  >
  <Button
    v-if="
      team.owner.email == user?.email ||
      team.members.find((member) => member.email == user?.email)
    "
    class-name="bi bi-box-arrow-left btn-danger w-100"
    >Подать заявку на выход</Button
  >
</template>
