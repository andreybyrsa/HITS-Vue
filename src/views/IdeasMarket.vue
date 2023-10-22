<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'

import Button from '@Components/Button/Button.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import SearchAndFilters from './Ideas/SearchAndFilters.vue'
import Typography from '@Components/Typography/Typography.vue'
import Market from '@Domain/Market'
import JoinIdeaModal from '@Components/Modals/JoinIdeaModal/JoinIdeaModal.vue'

import useUserStore from '@Store/user/userStore'
import IdeasMarketService from '@Services/MarketServise'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideas = ref<Market[]>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await IdeasMarketService.fetchIdeasMarket(token)

    if (response instanceof Error) {
      return
    }

    ideas.value = response
  }
})

const searchedValue = ref('')
const filters = [{}]
const selectedFilters = ref<string[]>([])

const favoriteIdeas = computed(() => ideas.value?.filter((idea) => idea.isFavorite))

const activeView = ref<'all' | 'favorites'>('all')

const toggleView = (view: 'all' | 'favorites') => {
  activeView.value = view
}

const toggleFavorite = (idea: Market) => {
  idea.isFavorite = !idea.isFavorite
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

const filteredIdeas = computed(() => {
  const searchTerm = searchedValue.value.toLowerCase()
  return ideas.value?.filter((idea) => idea.name.toLowerCase().includes(searchTerm))
})

const isOpenedJoinModal = ref(false)
function handleOpenJoinModal() {
  isOpenedJoinModal.value = true
}
function handleCloseJoinModal() {
  isOpenedJoinModal.value = false
}
</script>

<template>
  <PageLayout content-class-name="command-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>
    <template #content>
      <router-view />
      <Typography class-name="fs-2 text-primary w-75">Биржа идей</Typography>
      <SearchAndFilters
        :filtersData="filters"
        v-model:searchedValue="searchedValue"
        v-model:selectedFilters="selectedFilters"
      />
      <div class="market-modal-window__pages-headers">
        <Button @click="toggleView('all')">
          <Typography
            class-name="fs-5 text-primary border-bottom border-primary border-3"
          >
            Все
          </Typography>
        </Button>
        <Button @click="toggleView('favorites')">
          <Typography
            class-name="fs-5 text-primary border-bottom border-primary border-3"
            >Избранное
          </Typography>
        </Button>
      </div>
      <div class="ideas-container">
        <div v-if="activeView === 'all'">
          <div
            class="idea-card"
            v-for="(idea, index) in filteredIdeas"
            :key="index"
          >
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
                <Button prepend-icon-name="bi bi-person-circle">
                  Инициатор: {{ idea.initiator }}
                </Button>
              </div>
              <div class="idea-icons">
                <div class="icon">
                  <i class="bi bi-icon-name">
                    <div class="oval-badge">{{ idea.stack }}</div>
                  </i>
                </div>
                <div class="icon">
                  <i class="bi bi-icon-name">
                    <div class="oval-badge">{{ idea.stack }}</div>
                  </i>
                </div>
                <div class="icon">
                  <i class="bi bi-icon-name">
                    <div class="oval-badge">{{ idea.stack }}</div>
                  </i>
                </div>
              </div>
            </div>
            <div class="idea-card-right">
              <div class="idea-start-date">
                <div class="idea-start-date">
                  <Button prepend-icon-name="bi bi-clock-history">
                    Дата старта: {{ getFormattedDate(idea.creationDate) }}
                  </Button>
                </div>
              </div>
              <div class="idea-applications">
                <Button prepend-icon-name="bi bi-envelope-open">
                  Подано заявок: {{ idea.numberofRequests }}
                </Button>
              </div>
              <div class="idea-accepted-applications">
                <Button prepend-icon-name="bi bi-people-fill">
                  Команда: {{ idea.members }} / {{ idea.teamSize }}
                </Button>
              </div>
              <div class="idea-applications">
                <Button prepend-icon-name="bi bi-check2-all">
                  Статус: {{ idea.status }}
                </Button>
              </div>
              <div class="idea-buttons">
                <Button
                  class="apply-button"
                  prepend-icon-name="bi bi-send-fill"
                  @click="handleOpenJoinModal"
                >
                  Подать заявку
                </Button>
                <Button
                  class="favorite-button"
                  :class="{ 'is-favorite': idea.isFavorite }"
                  @click="toggleFavorite(idea)"
                >
                  <i
                    :class="[
                      'bi',
                      idea.isFavorite ? 'bi-star-fill' : 'bi-star',
                      'fs-4',
                    ]"
                  ></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeView === 'favorites'">
          <div
            class="idea-card"
            v-for="(idea, index) in favoriteIdeas"
            :key="index"
          >
            <div class="idea-card-left">
              <div class="idea-title">
                <Typography>#{{ idea.position }}</Typography>
              </div>
              <div class="idea-title">
                <router-link :to="'/idea/' + idea.id">{{ idea.name }}</router-link>
              </div>
              <div class="idea-description">
                {{ idea.description }}
              </div>
              <div class="idea-creator">
                <Button prepend-icon-name="bi bi-person-circle">
                  Инициатор: {{ idea.initiator }}
                </Button>
              </div>
              <div class="idea-icons">
                <div class="icon">
                  <i class="bi bi-icon-name">
                    <div class="oval-badge">{{ idea.stack }}</div>
                  </i>
                </div>
                <div class="icon">
                  <i class="bi bi-icon-name">
                    <div class="oval-badge">{{ idea.stack }}</div>
                  </i>
                </div>
                <div class="icon">
                  <i class="bi bi-icon-name">
                    <div class="oval-badge">{{ idea.stack }}</div>
                  </i>
                </div>
              </div>
            </div>
            <div class="idea-card-right">
              <div class="idea-start-date">
                <Button prepend-icon-name="bi bi-clock-history">
                  Дата старта: {{ getFormattedDate(idea.creationDate) }}
                </Button>
              </div>
              <div class="idea-applications">
                <Button prepend-icon-name="bi bi-envelope-open">
                  Подано заявок: {{ idea.numberofRequests }}
                </Button>
              </div>
              <div class="idea-accepted-applications">
                <Button prepend-icon-name="bi bi-people-fill">
                  Команда: {{ idea.members }} / {{ idea.teamSize }}
                </Button>
              </div>
              <div class="idea-applications">
                <Button prepend-icon-name="bi bi-check2-all">
                  Статус: {{ idea.status }}
                </Button>
              </div>
              <div class="idea-buttons">
                <Button
                  class="apply-button"
                  prepend-icon-name="bi bi-send-fill"
                >
                  Подать заявку
                </Button>
                <Button
                  class="favorite-button"
                  :class="{ 'is-favorite': idea.isFavorite }"
                  @click="toggleFavorite(idea)"
                >
                  <i
                    :class="[
                      'bi',
                      idea.isFavorite ? 'bi-star-fill' : 'bi-star',
                      'fs-4',
                    ]"
                  ></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PageLayout>
  <JoinIdeaModal
    :is-opened="isOpenedJoinModal"
    @close-modal="handleCloseJoinModal"
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
    font-size: 14px;
  }

  .idea-applications,
  .idea-accepted-applications {
    font-size: 14px;
    margin-top: 10px;
  }

  .idea-buttons {
    display: flex;
    align-items: flex-end;

    .apply-button {
      background-color: #007bff;
      color: white;
      margin-top: 10px;
      margin-right: 10px;
    }

    .favorite-button {
      background-color: #ffffff;
      color: rgb(255, 153, 0);
      margin-top: 10px;
    }
  }
}
.market-modal-window {
  width: 50%;
  justify-self: end;

  &__check-btn {
    @include flexible(flex-start, flex-end);
    width: 5%;
    font-size: 60%;
  }
  &__pages-headers {
    width: 100%;
    display: flex;
    justify-content: center;
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
