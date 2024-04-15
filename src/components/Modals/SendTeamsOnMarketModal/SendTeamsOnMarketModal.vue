<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'

import {
  SendTeamsOnMarketModalProps,
  SendTeamsOnMarketModalEmits,
} from '@Components/Modals/SendTeamsOnMarketModal/SendTeamsOnMarketModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Validation from '@Utils/Validation'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { Team } from '@Domain/Team'

import TeamService from '@Services/TeamService'
import MarketsService from '@Services/MarketService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import { Market } from '@Domain/Market'
import useTeamStore from '@Store/teams/teamsStore'

const props = defineProps<SendTeamsOnMarketModalProps>()
const emit = defineEmits<SendTeamsOnMarketModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const teamsStore = useTeamStore()

const notificationsStore = useNotificationsStore()

const checkedTeams = ref<Team[]>([])

const isLoading = ref(false)

const marketsActive = ref<Market[]>([])
const selectedMarketActive = ref<Market>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token && currentUser.role !== 'EXPERT') {
    const { token } = currentUser

    const response = await MarketsService.getAllActiveMarkets(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    marketsActive.value = response
  }
})

watchImmediate(
  () => props.teams,
  (value) => {
    checkedTeams.value = value
  },
  { deep: true },
)

const { handleSubmit } = useForm({
  validationSchema: {
    marketToSend: (value: Market) =>
      Validation.checkIsEmptyValue(value) || 'Выберите биржу',
  },
})

const sendTeamsToMarket = handleSubmit(async () => {
  const currentUser = user.value
  const currentMarket = selectedMarketActive.value

  if (currentUser?.token && currentMarket) {
    const { token } = currentUser
    const { id } = currentMarket
    isLoading.value = true

    const response = await TeamService.sendTeamOnMarket(
      id,
      checkedTeams.value,
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    teamsStore.changeTeamsStatusOnMarket(checkedTeams.value)

    isLoading.value = false
    emit('close-modal')
  }
})

function resetTeam(teamId: string) {
  const teamIndex = checkedTeams.value.findIndex(({ id }) => id === teamId)

  if (teamIndex !== -1) {
    checkedTeams.value.splice(teamIndex, 1)

    if (checkedTeams.value.length === 0) emit('close-modal')
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="send-teams-on-market-modal bg-white rounded p-3">
      <div class="send-teams-on-market-modal__team-date w-100">
        <Typography class-name="fs-5 w-100 text-secondary border-bottom">
          Отправить {{ checkedTeams.length === 1 ? 'команду' : 'команды' }} на биржу
        </Typography>
        <Button
          variant="close"
          @click="emit('close-modal')"
        />
      </div>

      <div class="w-100">
        <Combobox
          name="marketToSend"
          label="Биржа*"
          :options="marketsActive"
          :displayBy="(['name'] as never)"
          placeholder="Выберите биржу"
          v-model="selectedMarketActive"
        />
      </div>

      <div class="send-teams-on-market-modal__teams d-flex flex-column gap-2 w-100">
        <Typography class-name="w-100 text-primary">
          {{
            checkedTeams.length === 1 ? 'Выбранная команда' : 'Выбранные команды'
          }}*
        </Typography>
        <div
          v-for="(team, index) in teams"
          :key="index"
          class="d-flex gap-2 w-100"
        >
          <Typography
            class-name="send-teams-on-market-modal__team-name w-100 border rounded p-2"
          >
            {{ team.name }}
          </Typography>
          <Button
            variant="outline-danger"
            append-icon-name="bi bi-x"
            @click="resetTeam(team.id)"
          />
        </div>
      </div>

      <Button
        variant="success"
        @click="sendTeamsToMarket"
        :is-loading="isLoading"
      >
        Отправить на биржу
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.send-teams-on-market-modal {
  width: 500px;

  @include flexible(
    flex-start,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 8px
  );

  transition: all $default-transition-settings;

  &__team-date {
    @include flexible(center, space-between, $gap: 8px);
  }

  &__teams {
    max-height: 192px;
    overflow-y: scroll;
  }

  &__team-name {
    @include textEllipsis(1);
  }
}

.modal-layout-enter-from .send-ideas-on-market-modal,
.modal-layout-leave-to .send-ideas-on-market-modal {
  transform: scale(0.9);
}
</style>
