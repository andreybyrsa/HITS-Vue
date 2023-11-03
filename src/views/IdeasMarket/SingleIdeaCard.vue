<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import IdeasMarket from '@Domain/IdeasMarket'
import useUserStore from '@Store/user/userStore'
import IdeasMarketService from '@Services/IdeasMarketService'
import IdeasMarketStatusTypes from '@Domain/MarketStatus'
import getMarketStatus from '@Utils/getMarketStatus'
import Icon from '@Components/Icon/Icon.vue'
import SingleIdeaCardProps from '@Views/IdeasMarket/IdeasMarketView.types'
const availableStatus = getMarketStatus()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const props = defineProps<SingleIdeaCardProps>()
const ideas = defineModel<IdeasMarket[]>({ required: true })

function getFormattedDate(date: Date | string) {
  if (date) {
    if (date instanceof Date) {
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      return formattedDate.replace(/\//g, '.')
    } else {
      return date
    }
  }
  return ''
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
      return // notification
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
      return // notification
    }
    const currentIdeaIndex = ideas.value.findIndex((idea) => idea.id === id)
    if (props.isAllIdeas && currentIdeaIndex !== -1) {
      ideas.value[currentIdeaIndex].isFavorite = false
    } else if (!props.isAllIdeas && currentIdeaIndex !== -1) {
      ideas.value.splice(currentIdeaIndex, 1)
    }
  }
}
</script>
<template>
  <div class="idea-card">
    <div class="idea-card-left">
      <div class="idea-title">
        <Typography>#{{ idea.position }}</Typography>
      </div>
      <div class="idea-title">
        <router-link :to="'ideas/list/0' + idea.id">{{ idea.name }}</router-link>
      </div>
      <div class="idea-description">
        {{ idea.description }}
      </div>
      <div class="idea-creator">
        <Icon class-name="bi bi-person-circle fs-5" /> Инициатор:
        {{ idea.initiator }}
      </div>
      <div class="idea-icons">
        <div class="icon">
          <i class="bi bi-icon-name">
            <div class="oval-badge">{{ idea.stack[0].name }}</div>
          </i>
        </div>
        <div class="icon">
          <i class="bi bi-icon-name">
            <div class="oval-badge">{{ idea.stack[0].name }}</div>
          </i>
        </div>
        <div class="icon">
          <i class="bi bi-icon-name">
            <div class="oval-badge">{{ idea.stack[0].name }}</div>
          </i>
        </div>
      </div>
    </div>
    <div class="idea-card-right">
      <div class="idea-start-date">
        <div class="idea-start-date">
          <Icon class-name="bi bi-clock-history fs-5" />
          Дата старта: {{ getFormattedDate(idea.createdAt) }}
        </div>
      </div>
      <div class="idea-applications">
        <Icon class-name="bi bi-envelope-open fs-5" />
        Подано заявок: {{ idea.requests }}
      </div>
      <div class="idea-accepted-applications">
        <Icon class-name="bi bi-people-fill fs-5" />
        Команда: {{ idea.acceptedRequests }} / {{ idea.maxTeamSize }}
      </div>
      <div class="idea-applications">
        <Icon class-name="bi bi-check2-all fs-5" />
        Статус: {{ getTranslatedStatus(idea.status) }}
      </div>
      <div class="idea-buttons">
        <Button
          class="apply-button"
          prepend-icon-name="bi bi-send-fill"
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
  .idea-icons {
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
