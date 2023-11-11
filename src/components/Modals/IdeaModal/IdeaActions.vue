<script lang="ts" setup>
import { ref, VueElement, onMounted, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { IdeaActionsProps } from '@Components/Modals/IdeaModal/IdeaModal.types'
import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'

const props = defineProps<IdeaActionsProps>()

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
    const { status, initiator } = props.idea

    if (role === 'INITIATOR' && email === initiator) {
      return status === 'NEW' || status === 'ON_EDITING'
    }

    return role === 'ADMIN'
  }
}

function getAccessToApproval() {
  if (user.value) {
    const { role } = user.value
    const { status } = props.idea

    if (role === 'PROJECT_OFFICE') {
      return status === 'ON_APPROVAL'
    }

    return role === 'ADMIN'
  }
}

const handleSendToApproval = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = props.idea

    await ideasStore.updateIdeaStatus(id, 'ON_APPROVAL', token)
  }
}

const handleSendToEditing = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = props.idea

    await ideasStore.updateIdeaStatus(id, 'ON_EDITING', token)
  }
}

const handleSendToConfirmation = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = props.idea

    await ideasStore.updateIdeaStatus(id, 'ON_CONFIRMATION', token)
  }
}
</script>

<template>
  <div
    ref="ideaActionsButtons"
    class="rounded-3 bg-white p-3 d-flex flex-wrap gap-3"
  >
    <Button
      v-if="getAccessToEditByInitiator()"
      variant="light"
      @click="router.push(`/ideas/update/${idea.id}`)"
    >
      Редактировать
    </Button>

    <Button
      v-if="getAccessToEditByInitiator()"
      variant="success"
      @click="handleSendToApproval"
    >
      Отправить на согласование
    </Button>

    <Button
      v-if="getAccessToApproval()"
      variant="danger"
      @click="handleSendToEditing"
    >
      Отправить на доработку
    </Button>

    <Button
      v-if="getAccessToApproval()"
      variant="success"
      @click="handleSendToConfirmation"
    >
      Отправить на утверждение
    </Button>
  </div>
</template>
