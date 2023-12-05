<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { useRouter, useRoute, RouteRecordRaw } from 'vue-router'

import { MODE } from '@Main'

import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'
import { TeamModalInfoProps } from '@Components/Modals/TeamModal/TeamModal.types'
import Button from '@Components/Button/Button.vue'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'
import SkillsRadarChart from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.vue'
import { SkillsArea } from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.types'

const props = defineProps<TeamModalInfoProps>()

const router = useRouter()
const route = useRoute()

const isTextInfo = ref(true)

const isCopiedLink = ref(false)

const teamSkills = computed<SkillsArea[]>(() => [
  {
    label: 'Желаемые компетенции',
    skills: props.team.skills ?? [],
    alphaOpacity: 130,
  },
  {
    label: 'Фактические компетенции',
    skills: props.team.wantedSkills ?? [],
    alphaOpacity: 50,
  },
])

function getFormattedDate(date: string) {
  return useDateFormat(new Date(date), 'DD.MM.YYYY').value
}

function navigateToUserProfile(id: string) {
  const profileRoute: RouteRecordRaw = {
    name: 'profile',
    path: 'profile/:id',
    alias: '/profile/:id',
    component: ProfileModal,
    props: {
      canGoBack: true,
    },
  }

  router.addRoute('teams-list', profileRoute)
  router.push({ path: `/profile/${id}` })
}

function toggleTeamInfo(value: boolean) {
  isTextInfo.value = value
}

function copyLink() {
  const link =
    MODE === 'DEVELOPMENT'
      ? `http://localhost:3000${route.fullPath}`
      : `https://hits.tyuiu.ru${route.fullPath}`

  navigator.clipboard.writeText(link)
  isCopiedLink.value = true
}
</script>

<template>
  <div class="p-2 rounded-top d-flex gap-2">
    <Button
      :variant="isTextInfo ? 'primary' : 'secondary'"
      class-name="w-50"
      @click="toggleTeamInfo(true)"
    >
      Информация
    </Button>
    <Button
      :variant="!isTextInfo ? 'primary' : 'secondary'"
      class-name="w-50"
      @click="toggleTeamInfo(false)"
    >
      Компетенции
    </Button>
  </div>

  <div
    v-if="isTextInfo"
    class="team-modal-info w-100 pb-3 px-3"
  >
    <div class="w-100">
      <Typography class-name="border-bottom text-secondary d-block">
        Владелец команды
      </Typography>

      <div class="team-modal-info__item pt-2">
        <Icon class-name="bi bi-person-circle text-secondary fs-3 opacity-25" />

        <div
          class="team-modal-info__link"
          @click="navigateToUserProfile(team.owner.id)"
        >
          <Typography>
            {{ `${team.owner.firstName} ${team.owner.lastName}` }}
          </Typography>
        </div>
      </div>
    </div>

    <div
      v-if="team.leader"
      class="w-100"
    >
      <Typography class-name="border-bottom text-secondary d-block">
        Тим-лидер команды
      </Typography>

      <div class="team-modal-info__item pt-2">
        <Icon class-name="bi bi-person-circle text-secondary fs-3 opacity-25" />

        <div
          class="team-modal-info__link"
          @click="navigateToUserProfile(team.leader.id)"
        >
          <Typography>
            {{ `${team.leader.firstName} ${team.leader.lastName}` }}
          </Typography>
        </div>
      </div>
    </div>

    <div class="w-100">
      <Typography class-name="border-bottom text-secondary d-block">
        Дата создания
      </Typography>

      <div class="team-modal-info__item pt-2">
        <Icon class-name="bi bi-calendar-date text-secondary fs-3 opacity-25" />

        <Typography class-name="text-primary">
          {{ getFormattedDate(team.createdAt) }}
        </Typography>
      </div>
    </div>

    <div class="w-100">
      <Typography class-name="border-bottom text-secondary d-block">
        Количество участников:
        <Typography class-name="text-primary">{{ team.membersCount }}</Typography>
      </Typography>
    </div>

    <Button
      variant="primary"
      @click="copyLink"
    >
      {{ isCopiedLink ? 'Ссылка скопирована!' : 'Поделиться командой' }}
    </Button>
  </div>

  <div
    v-else
    class="team-modal-info px-2 pb-2"
  >
    <SkillsRadarChart
      :skills="teamSkills"
      :width="250"
      :height="250"
    />
  </div>
</template>

<style lang="scss" scoped>
.team-modal-info {
  @include flexible(stretch, flex-start, column, $gap: 16px);

  &__item {
    @include flexible(center, flex-start, $gap: 8px);
  }

  &__link {
    text-decoration: none;

    cursor: pointer;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 1px;
      text-decoration-color: $black-color;
    }
  }
}
</style>
