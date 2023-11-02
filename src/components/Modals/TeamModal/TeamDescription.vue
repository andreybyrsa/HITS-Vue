<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import ProfileSkillCharts from '@Components/Modals/TeamModal/ProfileSkillCharts.vue'
import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  TeamDescriptionEmits,
  TeamDescriptionProps,
} from '@Components/Modals/TeamModal/TeamModal.types'

import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import TeamMember from '@Domain/TeamMember'

defineProps<TeamDescriptionProps>()

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const emit = defineEmits<TeamDescriptionEmits>()

const handleKick = async (member: TeamMember, teamId: number) => {
  emit('handleKick', member, teamId)
}
</script>
<template>
  <div class="header">
    <Button
      class-name="btn-primary"
      prepend-icon-name="bi bi-backspace-fill"
      @click="emit('closeModal')"
    >
      Назад
    </Button>

    <Typography
      class-name="p-3 w-100 bg-white rounded-3 fs-6 text-primary text-nowrap overflow-x-scroll"
    >
      {{ team?.name }}
    </Typography>
  </div>
  <ul class="list-group rounded-3">
    <li class="list-group-item p-0 overflow-hidden">
      <Button
        class-name="fs-4 collapse-controller btn-light w-100"
        v-collapse="'teamDescription'"
      >
        Описание команды
      </Button>
      <Collapse id="teamDescription">
        <div class="px-3">
          {{ team.description }}
        </div>
      </Collapse>

      <Button
        class-name="collapse-controller fs-4 btn-light w-100"
        v-collapse="'teamMembers'"
      >
        Участники команды
      </Button>
      <Collapse
        class-name="collapse-content overflow-y-scroll"
        id="teamMembers"
      >
        <router-link
          v-for="member in team.members"
          :key="member.email"
          class="field nav-route list-group-item list-group-item-light"
          active-class="active"
          :to="'profile/' + member.id"
        >
          <Icon class-name="bi bi-person" />
          <Typography class="text-dark">{{
            member.firstName + ' ' + member.lastName
          }}</Typography>
          <Icon
            v-if="user?.email == team?.owner.email"
            class-name="bi bi-person-dash text-danger"
            @click="handleKick(member, team.id)"
          />
        </router-link>
      </Collapse>
      <div
        v-if="team.projects"
        class="bg-white rounded-3"
      >
        <Button
          class-name="collapse-controller fs-4 btn-light w-100"
          v-collapse="'teamProjects'"
        >
          Наши проекты
        </Button>
        <Collapse
          class-name="collapse-content"
          id="teamProjects"
          ><div
            class="field"
            v-for="project in team.projects"
            :key="project.id"
          >
            <Button class-name="project w-100">
              <Typography class-name="fs-5 text-dark text-start"
                >Проект: {{ project.name }}</Typography
              >
            </Button>
          </div></Collapse
        >
      </div>
    </li>
  </ul>
  <div
    class="w-100 p-3 bg-white rounded-3 text-primary text-nowrap overflow-x-scroll"
  >
    <Typography class="fs-4 py-2 d-flex justify-content-center"
      >Наши компетенции</Typography
    >
    <ProfileSkillCharts :team="team" />
  </div>
</template>

<style lang="scss" scoped>
.header {
  @include flexible(stretch, flex-start, $gap: 16px);
}
.field {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;
  @include flexible(stretch, flex-start, $gap: 16px);
}
.project {
  @include flexible(flex-start, flex-end, column, $gap: 16px);
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(stretch, flex-start, $gap: 16px);
}

.collapse-content {
  max-height: 600px;
}
</style>
