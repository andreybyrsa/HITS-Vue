<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Skills from '@Components/Skills/Skills.vue'

import {
  IdeaCardProps,
  IdeaCardEmits,
} from '@Views/IdeasMarket/IdeasMarketView.types'

import { IdeaMarket, IdeaMarketStatusType } from '@Domain/IdeaMarket'

import getMarketStatus from '@Utils/getMarketStatus'

import IdeasMarketService from '@Services/IdeasMarketService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import { useRoute } from 'vue-router'

const availableStatus = getMarketStatus()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const props = defineProps<IdeaCardProps>()
const emit = defineEmits<IdeaCardEmits>()
const ideas = defineModel<IdeaMarket[]>('ideas', { required: true })

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}
function getTranslatedStatus(status: IdeaMarketStatusType) {
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

function checkIdeaOwned() {
  return (
    user.value?.role === 'TEAM_OWNER' && props.idea.status === 'RECRUITMENT_IS_OPEN'
  )
}

const route = useRoute()
</script>

<template>
  <div class="col-xl-6">
    <div class="idea-card">
      <div class="idea-card-left">
        <div class="idea-title">
          <Typography>#{{ idea.position }}</Typography>
        </div>
        <div class="idea-title">
          <router-link :to="`${route.params.marketId}/${idea.id}`">{{
            idea.name
          }}</router-link>
        </div>
        <div class="idea-description">
          {{ idea.description }}
        </div>
        <div class="idea-creator">
          <Icon class-name="bi bi-person-circle fs-5" /> Инициатор:
          {{ idea.initiator?.firstName }} {{ idea.initiator?.lastName }}
        </div>
        <div class="idea-stacks">
          <Skills :skills="idea?.stack" />
        </div>
      </div>
      <div class="idea-card-right">
        <div class="idea-start-date">
          <Icon class-name="bi bi-clock-history fs-5" />

          <Typography>
            Дата старта: {{ getFormattedDate(idea.startDate) }}
          </Typography>
        </div>

        <div class="idea-applications">
          <Icon class-name="bi bi-envelope-open fs-5" />
          Подано заявок: {{ idea.requests }}
        </div>
        <div class="idea-applications">
          <Icon class-name="bi bi-envelope-open fs-5" />
          Принятно заявок: {{ idea.acceptedRequests }}
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
            v-if="checkIdeaOwned()"
            class="apply-button"
            prepend-icon-name="bi bi-send-fill"
            @click="emit('send-quick-request', idea)"
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
  </div>
</template>

<style lang="scss" scoped>
.idea-card {
  min-width: 100%;
  height: 100%;
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
    overflow-y: scroll;
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
    justify-content: end;
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
