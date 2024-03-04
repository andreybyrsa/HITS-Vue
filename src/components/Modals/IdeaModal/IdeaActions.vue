<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUserStore, useIdeasStore } from '@Store'
import { IdeaActionsProps } from '@Components/Modals/IdeaModal/IdeaModal.types'
import Button from '@Components/Button/Button.vue'

const props = defineProps<IdeaActionsProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasStore = useIdeasStore()

const router = useRouter()

const isSendingOnApproval = ref(false)
const isSendingOnEditing = ref(false)
const isSendingOnConfirmation = ref(false)

function getAccessToEdit() {
  if (user.value) {
    const { id, role } = user.value
    const { status, initiator } = props.idea

    if (role === 'INITIATOR' && id === initiator.id) {
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

const handleSendOnApproval = async () => {
  const currentUser = user.value

  if (currentUser?.role) {
    const { role } = currentUser
    const { id } = props.idea

    isSendingOnApproval.value = true
    await ideasStore.updateIdeaStatus(id, 'ON_APPROVAL', role)
    isSendingOnApproval.value = false
  }
}

const handleSendOnEditing = async () => {
  const currentUser = user.value

  if (currentUser?.role) {
    const { role } = currentUser
    const { id } = props.idea

    isSendingOnEditing.value = true
    await ideasStore.updateIdeaStatus(id, 'ON_EDITING', role)
    isSendingOnEditing.value = false
  }
}

const handleSendOnConfirmation = async () => {
  const currentUser = user.value

  if (currentUser?.role) {
    const { role } = currentUser
    const { id } = props.idea

    isSendingOnConfirmation.value = true
    await ideasStore.updateIdeaStatus(id, 'ON_CONFIRMATION', role)
    isSendingOnConfirmation.value = false
  }
}

function navigateToUpdateIdeaForm() {
  router.push(`/ideas/update/${props.idea.id}`)
}
</script>

<template>
  <div
    v-if="getAccessToEdit() || getAccessToApproval()"
    class="rounded-3 bg-white p-3 d-flex flex-wrap gap-3"
  >
    <Button
      v-if="getAccessToEdit()"
      variant="light"
      @click="navigateToUpdateIdeaForm"
    >
      Редактировать
    </Button>

    <Button
      v-if="getAccessToEdit()"
      variant="success"
      :is-loading="isSendingOnApproval"
      @click="handleSendOnApproval"
    >
      Отправить на согласование
    </Button>

    <Button
      v-if="getAccessToApproval()"
      variant="danger"
      :is-loading="isSendingOnEditing"
      @click="handleSendOnEditing"
    >
      Отправить на доработку
    </Button>

    <Button
      v-if="getAccessToApproval()"
      variant="success"
      :is-loading="isSendingOnConfirmation"
      @click="handleSendOnConfirmation"
    >
      Отправить на утверждение
    </Button>
  </div>
</template>
