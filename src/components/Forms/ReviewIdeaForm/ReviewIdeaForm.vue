<script lang="ts" setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@Store/user/userStore'

import ReviewIdeaFormProps from '@Components/Forms/ReviewIdeaForm/ReviewIdeaForm.types'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import FilterBar from '@Components/FilterBar/FilterBar.vue'
import SearchAndFilters from '@Views/Ideas/SearchAndFilters.vue'
import Typography from '@Components/Typography/Typography.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import ApplicationTeamsServise from '@Services/ApplicationTeamsServise'
import ApplicationTeams from '@Domain/ApplicationTeams'

defineProps<ReviewIdeaFormProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const searchedValue = ref('')
const selectedFilters = ref<string[]>([])

const selectedTeams = ref([])

const currrentFilters = [
  {
    category: 'Компетенции',
    choices: ['Vue.js', 'MySQL', 'React', 'Angular'],

    isUniqueChoice: false,
  },

  {
    category: 'Статус',
    choices: ['Ждут принятия', 'Приняты'],

    isUniqueChoice: true,
  },
]

const filters = [
  {
    label: 'Мои идеи',
    value: user.value?.email,
  },
  {
    label: 'На согласованнии',
    value: 'ON_APPROVAL',
  },
  {
    label: 'На утверждении',
    value: 'ON_CONFIRMATION',
  },
]

// const filteredIdeas = computed(() => {
//   const searchTerm = searchedValue.value.toLowerCase()
//   return teams.filter((team) => team.name.toLowerCase().includes(searchTerm))
// })

const teams = defineModel<ApplicationTeams[]>({ required: true })

function filterTeams(teams: ApplicationTeams[]) {
  return teams.filter((team) => team.accepted == false)
}

async function handleAddApplication(id: number) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await ApplicationTeamsServise.addApplicationTeams(id, token)

    if (response instanceof Error) {
      return // notification
    }

    teams.value = teams.value.filter((team) =>
      team.id == id ? (team.accepted = true) : team,
    )
  }
}
</script>

<template>
  <FormLayout
    v-if="user?.email == idea?.initiator"
    class-name="review-idea"
  >
    <div class="review-idea__content">
      <div
        class="review-idea__content-toolbar border border-top-0 px-4"
        v-if="selectedTeams.length > 0"
      >
        <Button class-name="btn-success">Принять</Button>
        <Button class-name="btn-danger">Удалить</Button>
      </div>
      <SearchAndFilters
        :filtersData="filters"
        v-model:searchedValue="searchedValue"
        v-model:selectedFilters="selectedFilters"
      />

      <div class="w-100 border-bottom text-secondary">
        <Typography>Заявки в команду: {{ filterTeams(teams).length }}</Typography>
      </div>

      <div class="review-idea__teams">
        <div
          class="team rounded border"
          v-for="(team, index) in filterTeams(teams)"
          :key="index"
        >
          <div class="team__main">
            <div class="team__main-checkbox">
              <Checkbox
                name="teamCheckbox"
                class-name="fs-4"
                :value="team.id"
                v-model="selectedTeams"
              ></Checkbox>
            </div>
            <div class="team__main-name-skills">
              <div class="h-50">
                <Button class-name="p-0 ">
                  <Typography class-name="fs-5 fw-bold ">{{ team.name }}</Typography>
                  <Icon class="bi bi-eye me-1 fs-4"></Icon>
                </Button>
              </div>
              <div class="skills">
                <div
                  class="skills__skill border rounded p-1"
                  v-for="(skill, index) in team.skills.slice(0, 4)"
                  :key="index"
                >
                  {{ skill.name }}
                </div>
                <Button
                  v-if="team.skills.length > 3"
                  class="fs-5 mt-3 p-0"
                  v-collapse="team.id"
                >
                  <Icon class="bi bi-three-dots"></Icon>
                </Button>
              </div>
            </div>
            <div class="team__main-info info">
              <div class="info__element">
                <Icon class="bi bi-clock-history me-1"></Icon>
                <Typography>Изменено {{ team.changedDate }}</Typography>
              </div>
              <div class="info__element">
                <Icon class="bi bi-people-fill me-1"></Icon>
                <Typography>Участников: {{ team.members.length }}</Typography>
              </div>
              <div class="info__element">
                <Icon class="bi bi-briefcase-fill me-1"></Icon>
                <Typography>Статус: {{ team.status }}</Typography>
              </div>
              <div class="info__buttons">
                <div class="info__buttons-more">
                  <Button
                    class-name="text-secondary p-0 me-1"
                    v-collapse="team.id"
                  >
                    info
                    <Icon class="bi bi-caret-down fs-5"></Icon>
                  </Button>
                </div>
                <div
                  class="info__buttons-accept"
                  v-if="team.status === 'Ждут принятия'"
                >
                  <Button
                    @click="handleAddApplication(team.id)"
                    class-name="bg-primary text-light"
                    >Принять</Button
                  >
                </div>
              </div>
            </div>
          </div>

          <Collapse :id="team.id">
            <div class="team__collapse">
              <div class="team__collapse-header header">
                <div class="header__skills-members p-2">
                  <div class="text-secondary border-bottom">
                    <Typography>Компетенции</Typography>
                  </div>
                  <div class="header__skills-members-elements p-1">
                    <div
                      class="header__skills-members-elements-element border rounded p-1"
                      v-for="(skill, index) in team.skills"
                      :key="index"
                    >
                      {{ skill.name }}
                    </div>
                  </div>
                </div>
                <div class="header__skills-members p-2">
                  <div class="text-secondary border-bottom">
                    <Typography>Участники</Typography>
                  </div>
                  <div class="header__skills-members-elements p-1">
                    <div
                      class="header__skills-members-elements-element border rounded p-1"
                      v-for="(member, index) in team.members"
                      :key="index"
                    >
                      {{ member.firstName }}{{ member.lastName }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="team__collapse-letter letter">
                <div class="letter__header text-secondary border-bottom">
                  <Typography>Мотивационное письмо</Typography>
                </div>
                <div class="letter__text">
                  <p>
                    {{ team.letter }}
                  </p>
                </div>
              </div>
            </div>
          </Collapse>
        </div>
      </div>
    </div>
    <!-- <FilterBar :filters="currrentFilters" /> -->
  </FormLayout>
</template>

<style lang="scss" scoped>
.review-idea {
  width: 100%;
  @include flexible(start, center, $gap: 8px);

  &__content {
    width: 100%;
    height: 100%;
    @include flexible(center, start, column, $gap: 8px);

    &-toolbar {
      width: 100%;
      border-radius: 0 0 50px 50px;
      padding: 16px;
      @include flexible(center, center, $gap: 8px);
    }
  }

  &__teams {
    width: 100%;
    height: 100%;
    @include flexible(center, start, column, $gap: 16px);
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.team {
  width: 100%;
  padding: 8px;

  &__main {
    width: 100%;
    height: 170px;
    @include flexible(start, start);

    &-checkbox {
      width: 20%;
      height: 100%;
      @include flexible(center, center);
    }

    &-name-skills {
      width: 40%;
      height: 100%;
      @include flexible(start, start, column);
    }

    &-info {
      width: 40%;
      height: 100%;
      @include flexible(end, start, column);
    }
  }

  &__collapse {
    width: 100%;

    @include flexible(start, start, column);

    &-header {
      width: 100%;
      @include flexible(start, start);
    }

    &-letter {
      width: 100%;
      @include flexible(start, start, column);
    }
  }
}

.skills {
  height: 50%;
  width: 100%;
  @include flexible(start, start, $gap: 4px);
  flex-wrap: wrap;

  &__skill {
    height: min-content;
    width: min-content;
  }
}

.info {
  &__element {
    width: 100%;
    height: 25%;
    @include flexible(center, end);
  }

  &__buttons {
    width: 100%;
    height: 25%;
    @include flexible(center, end);
  }
}

.header {
  &__skills-members {
    width: 50%;

    &-elements {
      width: 100%;
      @include flexible(start, start, $gap: 4px);
      flex-wrap: wrap;

      &-element {
        height: min-content;
        width: min-content;
      }
    }
  }
}

.letter {
  &__header {
    width: 100%;
    margin-bottom: 8px;
  }

  &__text {
    width: 100%;
    padding: 8px;
  }
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(209, 209, 209);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb {
  background-color: #0d6efd;
  border-radius: 20px;
  border: 3px solid #0d6efd;
}
</style>
