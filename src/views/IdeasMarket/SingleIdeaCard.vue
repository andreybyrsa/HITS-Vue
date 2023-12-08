<script lang="ts" setup>
import { Ref, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Skills from '@Components/Skills/Skills.vue'
import RequestToIdeaModal from '@Components/Modals/RequestToIdeaModal/RequestToIdeaModal.vue'

import SingleIdeaCardProps from '@Views/IdeasMarket/IdeasMarketView.types'

import IdeasMarket from '@Domain/IdeasMarket'
import IdeasMarketStatusTypes from '@Domain/MarketStatus'
import RequestTeams from '@Domain/RequestTeams'
import { Team } from '@Domain/Team'

import getMarketStatus from '@Utils/getMarketStatus'

import IdeasMarketService from '@Services/IdeasMarketService'
import RequestTeamsServise from '@Services/RequestTeamsServise'
import TeamService from '@Services/TeamService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { makeParallelRequests, RequestResult } from '@Utils/makeParallelRequests'

const availableStatus = getMarketStatus()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const props = defineProps<SingleIdeaCardProps>()
const ideas = defineModel<IdeasMarket[]>('ideas', { required: true })

const requestTeams = ref<RequestTeams[]>()
const teams = ref<Team[]>()

function checkResponseStatus<T>(
  data: RequestResult<T>,
  refValue: Ref<T | undefined>,
) {
  if (data.status === 'fulfilled') {
    refValue.value = data.value
  } else {
    // notification
  }
}

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const teamsParallelRequests = [
      () => RequestTeamsServise.getRequestAll(props.idea.id, token),
      () => TeamService.getTeams(token),
    ]

    await makeParallelRequests<RequestTeams[] | Team[] | Error>(
      teamsParallelRequests,
    ).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, requestTeams)
        } else if (response.id === 1) {
          checkResponseStatus(response, teams)
        }
      })
    })
  }
})

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}
function getTranslatedStatus(status: IdeasMarketStatusTypes) {
  return availableStatus.translatedStatus[status]
}

const handleAddIdeaToFavorites = async () => {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea

    const response = await IdeasMarketService.addIdeaToFavorites(id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const currentIdea = ideas.value.find((idea) => idea.id === id)

    if (currentIdea) {
      currentIdea.isFavorite = true
    }
  }
}

const handleRemoveIdeaFromFavorites = async () => {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea

    const response = await IdeasMarketService.removeIdeaFromFavorites(id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const currentIdeaIndex = ideas.value.findIndex((idea) => idea.id === id)

    if (props.isAllIdeas && currentIdeaIndex !== -1) {
      ideas.value[currentIdeaIndex].isFavorite = false
    } else if (!props.isAllIdeas && currentIdeaIndex !== -1) {
      ideas.value.splice(currentIdeaIndex, 1)
    }
  }
}

const isOpenRequestToIdeaModal = ref<boolean>(false)
function openRequestToIdeaModal() {
  isOpenRequestToIdeaModal.value = true
}
function closeRequestToIdeaModal() {
  isOpenRequestToIdeaModal.value = false
}
</script>

<template>
  <div class="idea-card">
    <div class="idea-card-left">
      <div class="idea-title">
        <Typography>#{{ idea.position }}</Typography>
      </div>
      <div class="idea-title">
        <router-link :to="'market/' + idea.id">{{ idea.name }}</router-link>
      </div>
      <div class="idea-description">
        {{ idea.description }}
      </div>
      <div class="idea-creator">
        <Icon class-name="bi bi-person-circle fs-5" /> Инициатор:
        {{ idea.initiator.firstName }} {{ idea.initiator.lastName }}
      </div>
      <div class="idea-stacks">
        <Skills :skills="idea?.stack" />
      </div>
    </div>
    <div class="idea-card-right">
      <div class="idea-start-date">
        <div class="idea-start-date">
          <Icon class-name="bi bi-clock-history fs-5" />
          Дата старта: {{ getFormattedDate(idea.startDate) }}
        </div>
      </div>
      <div class="idea-applications">
        <Icon class-name="bi bi-envelope-open fs-5" />
        Подано заявок: {{ idea.requests }}
      </div>
      <div class="idea-applications">
        <Icon class-name="bi bi-envelope-open fs-5" />
        Принятые заявки: {{ idea.acceptedRequests }}
      </div>
      <div class="idea-accepted-applications">
        <Icon class-name="bi bi-people-fill fs-5" />
        Требуется участников: {{ idea.maxTeamSize }}
      </div>
      <div class="idea-applications">
        <Icon class-name="bi bi-check2-all fs-5" />
        Статус: {{ getTranslatedStatus(idea.status) }}
      </div>
      <div class="idea-buttons">
        <Button
          v-if="user?.email != idea.initiator.email"
          class="apply-button"
          prepend-icon-name="bi bi-send-fill"
          @click="openRequestToIdeaModal"
        >
          Подать заявку
        </Button>
        <div class="favorite-button">
          <Icon
            v-if="!idea.isFavorite"
            class-name="bi bi-star fs-4"
            style="color: #ff9900"
            @click="handleAddIdeaToFavorites"
          />
          <Icon
            v-else
            class-name="bi bi-star-fill fs-4"
            style="color: #ff9900"
            @click="handleRemoveIdeaFromFavorites"
          />
        </div>
      </div>
    </div>
  </div>

  <RequestToIdeaModal
    v-if="teams && requestTeams"
    :is-opened="isOpenRequestToIdeaModal"
    @close-modal="closeRequestToIdeaModal"
    :idea="idea"
    v-model:teams="teams"
    v-model:requestTeams="requestTeams"
  />
</template>

<style lang="scss">
.idea-card {
  display: flex;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  .idea-card-left {
    flex: 1;
    padding-right: 20px;
  }
  .idea-card-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
  }
  .idea-title {
    font-size: 20px;
    font-weight: bold;
  }
  .idea-description {
    margin-top: 10px;
  }
  .idea-creator {
    margin-top: 10px;
    display: flex;
    align-items: center;
  }
  .idea-stacks {
    display: flex;
    margin-top: 35px;
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      margin-top: 35px;
    }
  }
  .idea-start-date {
    font-size: 16px;
    display: flex;
    align-items: center;
  }
  .bi {
    margin-right: 5px;
  }
  .idea-applications,
  .idea-accepted-applications {
    font-size: 16px;
    margin-top: 10px;
    display: flex;
    align-items: center;
  }
  .idea-buttons {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .apply-button {
      background-color: #007bff;
      color: white;
      margin-top: 10px;
      margin-right: 10px;
    }
    .favorite-button {
      background-color: #ffffff;
      color: rgb(255, 153, 0);
      margin-top: 13px;
    }
  }
}
.oval-badge {
  display: inline-block;
  padding: 5px 15px;
  border-radius: 50px;
  background-color: #007bff;
  color: white;
  font-size: 14px;
}
</style>
