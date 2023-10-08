<script setup lang="ts">
import { storeToRefs } from 'pinia'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import {
  TeamModalEmits,
  TeamModalProps,
} from '@Components/Modals/TeamModal/TeamModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Icon from '@Components/Icon/Icon.vue'
import TeamAction from '@Components/Modals/TeamModal/TeamAction.vue'
import ProfileSkillCharts from '@Components/Modals/TeamModal/ProfileSkillCharts.vue'
import TeamModalPlaceholder from '@Components/Modals/TeamModal/TeamModalPlaceholder.vue'

import { User } from '@Domain/User'

import useUserStore from '@Store/user/userStore'

import TeamService from '@Services/TeamService'

defineProps<TeamModalProps>()
const emit = defineEmits<TeamModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function closeTeamModal() {
  emit('close-modal')
}

const handleKick = async (user: User, teamId: string) => {
  if (user.token) {
    const { token } = user
    const response = await TeamService.kickMember(user, teamId, token)

    if (response instanceof Error) {
      return
    }
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeTeamModal"
  >
    <div
      v-if="team"
      class="team-modal p-3 overflow-y-scroll"
      ref="teamModalRef"
    >
      <div class="team-modal__left-side w-75">
        <div class="team-modal__header">
          <Button
            class-name="btn-primary"
            prepend-icon-name="bi bi-backspace-fill"
            @click="closeTeamModal"
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
              class-name="fs-4 collapse-controller btn-light w-100"
              v-collapse="'teamMembers'"
            >
              Участники команды
            </Button>
            <Collapse
              class="collapse-content overflow-y-scroll"
              id="teamMembers"
            >
              <router-link
                v-for="member in team.members"
                :key="member.email"
                class="team-modal__single-field nav-route list-group-item list-group-item-light"
                active-class="active"
                :to="'profile/' + member.email"
              >
                <Icon class-name="bi bi-person" />
                <Typography class="text-dark">{{
                  member.firstName + ' ' + member.lastName
                }}</Typography>
                <Icon
                  v-if="user?.email == team?.owner.email"
                  class-name="bi bi-person-dash text-danger"
                  @click="handleKick(member, team?.id)"
                />
              </router-link>
            </Collapse>
            <div
              v-if="team.projects"
              class="py-2 bg-white rounded-3"
            >
              <Typography class-name="p-3 w-100 fs-4 text-primary">
                Наши проекты
              </Typography>
              <div
                class="team-modal__single-field"
                v-for="project in team.projects"
                :key="project.id"
              >
                <Button class-name="team-modal__project w-100">
                  <Typography class-name="w-100 fs-6 text-dark text-start"
                    >Проект: {{ project.name }}</Typography
                  >
                  <Typography
                    class-name="team-modal__project__description fs-6 text-secondary"
                    >Описание: {{ project.description }}</Typography
                  >
                </Button>
              </div>
            </div>
          </li>
        </ul>
        <div
          class="p-3 w-100 bg-white rounded-3 text-primary text-nowrap overflow-x-scroll"
        >
          <Typography class="fs-4 py-2 d-flex justify-content-center"
            >Наши компетенции</Typography
          >
          <ProfileSkillCharts :team="team"></ProfileSkillCharts>
        </div>
      </div>
      <div class="p-3 team-modal__right-side rounded w-25 bg-white">
        <Typography class-name="text-primary text-nowrap team-modal__single-field"
          >Владелец команды:
          <router-link
            class="nav-route list-group-item list-group-item-light"
            active-class="active"
            :to="'profile/' + team?.owner.email"
          >
            <Typography class="text-primary">{{
              team.owner.firstName + ' ' + team.owner.lastName
            }}</Typography>
          </router-link>
        </Typography>

        <Typography class-name="text-primary text-nowrap team-modal__single-field"
          >Лидер команды:
          <router-link
            class="nav-route list-group-item list-group-item-light"
            active-class="active"
            :to="'profile/' + team.leader.email"
          >
            <Typography class="text-primary">{{
              team.leader.firstName + ' ' + team.leader.lastName
            }}</Typography>
          </router-link>
        </Typography>
        <TeamAction :team="team"></TeamAction>
      </div>
    </div>
    <div v-else>
      <TeamModalPlaceholder></TeamModalPlaceholder>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.team-modal {
  position: relative;

  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &__header {
    @include flexible(stretch, flex-start, $gap: 16px);
  }

  &__single-field {
    border-radius: 0;
    background-color: $white-color;

    color: $primary-color;
    @include flexible(stretch, flex-start, $gap: 16px);
  }

  &__left-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }

  &__right-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
  &__project {
    @include flexible(flex-start, flex-end, column, $gap: 16px);
    &__description {
      width: 70%;

      overflow: hidden;
      white-space: nowrap;

      text-overflow: ellipsis;
    }
  }
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
.modal-layout-enter-from .team-modal,
.modal-layout-leave-to .team-modal {
  transform: translateX(100%);
}
</style>
