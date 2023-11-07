<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDateFormat } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import mutableSort from '@Utils/mutableSort'

import useUserStore from '@Store/user/userStore'

import TeamService from '@Services/TeamService'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import {
  TeamAccessionsModalEmits,
  TeamAccessionsModalProps,
} from '@Components/Modals/TeamAccessionsModal/TeamAccessionsModal.types'
import TeamAccessionsHeader from '@Components/Modals/TeamAccessionsModal/TeamAccessionsHeader.vue'
import TeamAccessionsTable from '@Components/Tables/TeamAccessionsTable/TeamAccessionsTable.vue'
import { TableColumn } from '@Components/Table/Table.types'

import { TeamAccession, accessionStage } from '@Domain/TeamAccession'
import TeamMember from '@Domain/TeamMember'

const props = defineProps<TeamAccessionsModalProps>()

const emits = defineEmits<TeamAccessionsModalEmits>()

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const allAccessions = ref<TeamAccession[]>()

const columns: TableColumn<TeamAccession>[] = [
  {
    key: 'targetRegistered',
    label: 'Тип основного лица',
    getRowCellFormat: getTargetUserTypeFormat,
    getRowCellStyle: getTargetUserTypeStyle,
  },
  {
    key: 'targetEmail',
    label: 'Основное лицо',
  },
  {
    key: 'stage',
    label: 'Этап',
    getRowCellFormat: getStatusFormat,
    getRowCellStyle: getStageStyle,
  },
  {
    key: 'inviter',
    label: 'Отправитель приглашения',
    getRowCellFormat: getInviterFormat,
    rowCellClick: navigateToInviterProfile,
  },
  {
    key: 'updatedAt',
    label: 'Последнее обновление',
    getRowCellFormat: getFormattedDate,
    headerCellClick: sortByUpdatedAt,
  },
]

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.getAllTeamAccessions(props.team.id, token)

    if (response instanceof Error) {
      return //уведомление об ошибке
    }

    allAccessions.value = response
  }
})

function getTargetUserTypeFormat(targetRegistered: boolean) {
  return targetRegistered ? 'Пользователь с портала' : 'Внешний пользователь'
}

function getTargetUserTypeStyle(targetRegistered: boolean) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (!targetRegistered) {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }

  initialClass.push('bg-success-subtle', 'text-success')
  return initialClass
}

function getStatusFormat(stage: accessionStage) {
  return stage == 'INVITATION'
    ? 'Приглашение'
    : stage == 'REQUEST'
    ? 'Заявка'
    : stage == 'ACCEPTED'
    ? 'Принято'
    : 'Отклонено'
}

function getStageStyle(stage: accessionStage) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (stage === 'INVITATION') {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }

  if (stage === 'REQUEST' || status === 'ON_APPROVAL') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }

  if (stage === 'REJECTED') {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }

  if (stage === 'ACCEPTED') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }
}

function getInviterFormat(inviter?: TeamMember) {
  if (inviter) {
    return inviter.firstName + ' ' + inviter.lastName
  }
  return ''
}

function navigateToInviterProfile(teamAccession: TeamAccession) {
  if (teamAccession.inviter) {
    router.push(`profile/${teamAccession.inviter.id}`)
  }
}

function getFormattedDate(date: string) {
  const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
  return formattedDate.value
}

function sortByUpdatedAt() {
  if (allAccessions.value) {
    mutableSort(allAccessions.value, (teamAccession: TeamAccession) =>
      new Date(teamAccession.updatedAt).getTime(),
    )
  }
}

function closeTeamModal() {
  emits('close-modal')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeTeamModal"
    ><div class="list-modal p-3">
      <TeamAccessionsHeader
        :team="team"
        @close-team-modal="closeTeamModal"
      />
      <TeamAccessionsTable
        v-if="allAccessions"
        :columns="columns"
        :team="team"
        v-model="allAccessions"
        search-by="targetEmail"
      />
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.list-modal {
  position: relative;

  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #ffffff;

  @include flexible(
    stretch,
    flex-start,
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;
}

.modal-layout-enter-from .list-modal,
.modal-layout-leave-to .list-modal {
  transform: translateX(100%);
}
</style>
