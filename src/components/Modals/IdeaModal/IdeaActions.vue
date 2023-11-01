<script lang="ts" setup>
import { ref, VueElement, onMounted, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Button from '@Components/Button/Button.vue'

import { Idea } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'

import useNotificationsStore from '@Store/notifications/notificationsStore'

const notificationsStore = useNotificationsStore()

const idea = defineModel<Idea>({ required: true })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasStore = useIdeasStore()

const router = useRouter()

const ideaActionsButtons = ref<VueElement | null>()

onMounted(() => checkComponentContent())
onUpdated(() => checkComponentContent())

function checkComponentContent() {
  if (ideaActionsButtons.value && ideaActionsButtons.value.childElementCount === 0) {
    ideaActionsButtons.value.remove()
  }
}

function getAccessToEditByInitiator() {
  if (user.value) {
    const { email, role } = user.value
    const { status, initiator } = idea.value

    if (status === 'NEW' || status === 'ON_EDITING') {
      if (role === 'ADMIN') return true

      return email === initiator
    }
  }
}

function getAccessToApproval() {
  if (user.value) {
    const { role } = user.value
    const { status } = idea.value

    if (status === 'ON_APPROVAL') {
      if (role === 'ADMIN') return true

      return role === 'PROJECT_OFFICE'
    }
  }
}

const handleSendToApproval = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = idea.value

<<<<<<< HEAD
    const response = await IdeasService.sendIdeaOnApproval(id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    idea.value.status = 'ON_APPROVAL'
=======
    await ideasStore.sendIdeaOnApproval(id, token)
>>>>>>> main
  }
}

const handleSendToEditing = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = idea.value

<<<<<<< HEAD
    const response = await IdeasService.updateIdeaStatusByProjectOffice(
      id,
      'ON_EDITING',
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    idea.value.status = 'ON_EDITING'
=======
    await ideasStore.updateIdeaStatusByProjectOffice(id, 'ON_EDITING', token)
>>>>>>> main
  }
}

const handleSendToConfirmation = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = idea.value

<<<<<<< HEAD
    const response = await IdeasService.updateIdeaStatusByProjectOffice(
      id,
      'ON_CONFIRMATION',
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    idea.value.status = 'ON_CONFIRMATION'
=======
    await ideasStore.updateIdeaStatusByProjectOffice(id, 'ON_CONFIRMATION', token)
>>>>>>> main
  }
}
</script>

<template>
  <div
    ref="ideaActionsButtons"
    class="rounded-3 bg-white p-3 d-flex gap-3"
  >
    <Button
      v-if="getAccessToEditByInitiator()"
      class-name="btn-light"
      @click="router.push(`/ideas/update/${idea.id}`)"
    >
      Редактировать
    </Button>

    <Button
      v-if="getAccessToEditByInitiator()"
      class-name="btn-success"
      @click="handleSendToApproval"
    >
      Отправить на согласование
    </Button>

    <Button
      v-if="getAccessToApproval()"
      class-name="btn-danger"
      @click="handleSendToEditing"
    >
      Отправить на доработку
    </Button>

    <Button
      v-if="getAccessToApproval()"
      class-name="btn-success"
      @click="handleSendToConfirmation"
    >
      Отправить на утверждение
    </Button>
  </div>
</template>
