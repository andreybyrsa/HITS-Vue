<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ProfileProps, ProfileEmits } from '@Views/Profile/Profile.types'
import useCommentsStore from '@Store/comments/commentsStore'
import RolesTypes from '@Domain/Roles'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

import useUserStore from '@Store/user/userStore'

defineProps<ProfileProps>()
const emit = defineEmits<ProfileEmits>()

const commentStore = useCommentsStore()
const { rsocketIsConnected, closeRsocket } = storeToRefs(commentStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function closeProfile() {
  emit('close-modal')

  if (rsocketIsConnected.value) {
    closeRsocket.value()
  }
}

function getCurrentRoleRus(role: RolesTypes) {
  if (role === 'ADMIN') {
    return 'Админ '
  }
  if (role === 'INITIATOR') {
    return 'Инициатор '
  }
  if (role === 'PROJECT_OFFICE') {
    return 'Проектный офис '
  }
  if (role === 'EXPERT') {
    return 'Эксперт '
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeProfile"
  >
    <div class="profile p-3 overflow-y-scroll">
      <div class="w-100 h-100">
        <div class="profile__header w-100 mb-3">
          <Button
            class-name="btn-primary"
            prepend-icon-name="bi bi-backspace-fill"
            @click="emit('close-modal')"
          >
            Назад
          </Button>

          <Typography
            class-name="p-2 w-100 bg-white rounded-3 fs-4 text-primary text-nowrap overflow-scroll-hidden"
          >
            {{ user.lastName }} {{ user.firstName }}
          </Typography>
        </div>

        <div class="profile__content">
          <div class="profile__user bg-white border p-3 rounded-4">
            <div class="profile__user__head mb-2">
              <Typography class-name="text-secondary">НЕ В СЕТИ</Typography>
              <Typography class-name="text-secondary"
                >Был в сети 17:23 27.09.2023</Typography
              >
            </div>
            <div class="d-flex justify-content-center w-100 mb-2">
              <img
                src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ3bieKJm2Fv_x9vA6rcBnqa2-BG93gnmRYM5TT0WxAVgQtfH4L"
                alt="Avatar"
                class="avatar"
              />
            </div>
            <div class="profile__user__roles w-100">
              <div
                class="w-25 text-center border rounded-pill p-2 bg-light"
                v-for="role in user.roles"
                :key="role"
              >
                {{ getCurrentRoleRus(role) }}
              </div>
            </div>
          </div>

          <div class="profile__info">
            <div class="w-100 bg-white border p-3 rounded-4">
              <div class="profile__info__header border-bottom pb-1">
                <Typography class-name="fs-4 text-primary">Информация</Typography>
                <Button class-name="border bg-light rounded-pill">изменить</Button>
              </div>

              <div class="profile__info__content p-2">
                <div class="d-grid">
                  <Typography class-name=" text-secondary">Имя</Typography>
                  <Typography class-name="fs-5 ms-1">{{
                    user.firstName
                  }}</Typography>
                </div>
                <div class="d-grid">
                  <Typography class-name=" text-secondary">Фамилия</Typography>
                  <Typography class-name="fs-5 ms-1">{{ user.lastName }}</Typography>
                </div>
                <div class="d-grid">
                  <Typography class-name=" text-secondary">Почта</Typography>
                  <Typography class-name="fs-5 ms-1">{{ user.email }}</Typography>
                </div>
                <div class="d-grid">
                  <Typography class-name=" text-secondary">Главная роль</Typography>
                  <Typography class-name="fs-5 ms-1">{{
                    getCurrentRoleRus(user.role)
                  }}</Typography>
                </div>
                <div class="d-grid">
                  <Typography class-name=" text-secondary">Язык</Typography>
                  <Typography class-name="fs-5 ms-1 text-muted"
                    >Не выбран</Typography
                  >
                </div>
              </div>
            </div>

            <div class="w-100 bg-white border p-3 rounded-4">
              <div class="profile__info__header border-bottom pb-1">
                <Typography class-name="fs-4 text-primary"
                  >Мои компетенции</Typography
                >
                <Button class-name="border bg-light rounded-pill"
                  >изменить стек</Button
                >
              </div>
              <div class="profile__info__content p-2">
                <div
                  class="profile__info__content__skills border p-2 fs-5 rounded-4 bg-white"
                >
                  <Typography class-name="fs-5">JavaScript</Typography>
                  <Typography class-name="text-warning">5/10</Typography>
                </div>
                <div
                  class="profile__info__content__skills border p-2 fs-5 rounded-4 bg-white"
                >
                  <Typography class-name="fs-5">Vue.JS</Typography>
                  <Typography class-name="text-success">7/10</Typography>
                </div>
                <div
                  class="profile__info__content__skills border p-2 fs-5 rounded-4 bg-white"
                >
                  <Typography class-name="fs-5">SQL</Typography>
                  <Typography class-name="text-danger">2/10</Typography>
                </div>
              </div>
            </div>

            <div class="w-100 bg-white border p-3 rounded-4">
              <div class="profile__info__header border-bottom pb-1">
                <Typography class-name="fs-4 text-primary">Мое портфолио</Typography>
              </div>
              <div class="profile__info__content p-2">
                <div
                  class="profile__info__content__projects border w-100 p-2 fs-5 rounded bg-white"
                >
                  <Typography class-name="fs-5">Проект</Typography>
                  <Typography class-name="text-muted ms-3"
                    >Ядерный синтез электронов в ЭВМ</Typography
                  >
                </div>

                <div
                  class="profile__info__content__projects border w-100 p-2 fs-5 rounded bg-white"
                >
                  <Typography class-name="fs-5">Идея</Typography>
                  <Typography class-name="text-muted ms-3"
                    >Реализация калькулятора на основе сверхзвукового
                    нажатия</Typography
                  >
                </div>

                <div
                  class="profile__info__content__projects border w-100 p-2 fs-5 rounded bg-white"
                >
                  <Typography class-name="fs-5">Проект</Typography>
                  <Typography class-name="text-muted ms-3"
                    >Веб-сайт для познания Vue.JS в разных агрегатных
                    состояниях</Typography
                  >
                </div>

                <div
                  class="profile__info__content__projects border w-100 p-2 fs-5 rounded bg-white"
                >
                  <Typography class-name="fs-5">Иедя</Typography>
                  <Typography class-name="text-muted ms-3"
                    >Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Dolorum beatae rem porro facilis adipisci accusamus, velit
                    doloremque ea neque quis atque cum dolore perspiciatis pariatur,
                    nostrum ex! Dolore, necessitatibus laudantium?</Typography
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.profile {
  position: relative;
  height: 100%;
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
    width: 100%;
    height: fit-content;
    @include flexible(stretch, flex-start, $gap: 16px);
  }

  &__content {
    width: 100%;
    height: 100%;
    @include flexible(stretch, flex-start, $gap: 16px);
  }

  &__user {
    width: 33%;
    height: fit-content;
    display: block;

    &__head {
      @include flexible(flex-end, center, column);
    }
    &__roles {
      @include flexible(center, center, $gap: 8px);
    }
  }

  &__info {
    width: 66%;
    height: 100%;
    display: block;
    @include flexible(center, flex-start, column, $gap: 16px);

    &__header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &__content {
      width: 100%;
      @include flexible(flex-start, flex-start, column, $gap: 16px);

      &__skills {
        width: 50%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      &__projects {
        width: 50%;
        @include flexible(flex-start, flex-start, column);
      }
    }
  }
}

.modal-layout-enter-from .profile,
.modal-layout-leave-to .profile {
  transform: translateX(100%);
}

.avatar {
  border-radius: 50%;
  width: 250px;
  height: 250px;
}
</style>
