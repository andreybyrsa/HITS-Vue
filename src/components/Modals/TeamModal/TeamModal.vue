<script setup lang="ts">
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

const props = defineProps<TeamModalProps>()
const emit = defineEmits<TeamModalEmits>()

function closeTeamModal() {
  emit('close-modal')
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
                :key="member.id"
                class="team-modal__single-field nav-route list-group-item list-group-item-light"
                active-class="active"
                :to="'profile/' + member.id"
              >
                <Icon class-name="bi bi-person" />
                <Typography class="text-dark">{{
                  member.firstName + ' ' + member.lastName
                }}</Typography>
              </router-link>
            </Collapse>
          </li>
          <div class="bg-white rounded-3">
            <Typography class-name="p-3 w-100 fs-4 text-primary">
              Наше портфолио
            </Typography>
            <div
              v-for="portfolio in team.portfolio"
              :key="portfolio.id"
            >
              <Button
                ><Typography
                  class-name="p-3 w-100 fs-6 text-dark text-nowrap overflow-x-scroll"
                  >{{ portfolio.name }}</Typography
                >
                <Typography
                  class-name="team-modal__description p-3 w-100 fs-6 text-secondary"
                  >{{ portfolio.description }}</Typography
                >
              </Button>
            </div>
          </div>
        </ul>
      </div>
      <div class="team-modal__right-side rounded w-25 bg-white">
        <Typography
          class-name="px-2 text-primary text-nowrap team-modal__single-field"
          >Владелец команды:
          <router-link
            class="nav-route list-group-item list-group-item-light"
            active-class="active"
            :to="'profile/' + team?.owner.id"
          >
            <Typography class="text-primary">{{
              team.owner.firstName + ' ' + team.owner.lastName
            }}</Typography>
          </router-link>
        </Typography>

        <Typography
          class-name="px-2 text-primary text-nowrap team-modal__single-field"
          >Лидер команды:
          <router-link
            class="nav-route list-group-item list-group-item-light"
            active-class="active"
            :to="'profile/' + team.leader.id"
          >
            <Typography class="text-primary">{{
              team.leader.firstName + ' ' + team.leader.lastName
            }}</Typography>
          </router-link>
        </Typography>
        <TeamAction :team="team"></TeamAction>
      </div>
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
  &__description {
    max-width: fit-content;
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
