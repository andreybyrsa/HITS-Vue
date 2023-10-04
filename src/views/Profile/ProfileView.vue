<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { ProfileProps, ProfileEmits } from '@Views/Profile/Profile.types'
import useCommentsStore from '@Store/comments/commentsStore'
import RolesTypes from '@Domain/Roles'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

import useUserStore from '@Store/user/userStore'
import Collapse from '@Components/Collapse/Collapse.vue'
import StackCategories from '@Components/Forms/IdeaForm/StackCategories.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import ChangeEmailView from '@Views/ChangeEmailView.vue'

defineProps<ProfileProps>()
const emit = defineEmits<ProfileEmits>()

const commentStore = useCommentsStore()
const { rsocketIsConnected, closeRsocket } = storeToRefs(commentStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const editSkills = ref(false)

const skills = ref([])

const isOpenedChangeEmail = ref(false)

const { values, handleSubmit } = useForm({
  validationSchema: {
    component: (value: string) => value?.length || 'Обязательно к заполнению',
  },
  initialValues: {
    combobox: [],
    component: '',
  },
})

const projects = [
  {
    name: 'Поднятие уровня моря',
    discription: 'Надо бы поднять уровень моря',
    id: '5345534356',
  },
  {
    name: 'Еда экспресс',
    discription: 'Технология эффективного питания',
    id: '534443557356',
  },
  {
    name: 'Крутой',
    discription: 'Очень крутой проект',
    id: '5344387656',
  },
]

const ideas = [
  {
    name: 'Как чистить картошку',
    discription: 'Новейшие методы чистки картофиля в различных состояниях',
    id: '4565423',
  },
  {
    name: 'Быстрая покраска морковок',
    discription: 'Разработка технологии по мнгновенному покрасу моркови в кортофель',
    id: '5433492225',
  },
  {
    name: 'Иделаьная',
    discription: 'Ну уж очень классная идея',
    id: '4578934895348543',
  },
]

const fieldSubmit = handleSubmit((values) => console.log(values))

function editSkillsHandler() {
  editSkills.value = true
}

function editSkillsClose() {
  editSkills.value = false
}

function skillLevel(level: string) {
  if (level === 'Интересуюсь') {
    return 'text-danger'
  }
  if (level === 'Профессионал') {
    return 'text-success'
  }
  if (level === 'Владею') {
    return 'text-warning'
  }
}

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

function handleOpenChangeEmail() {
  isOpenedChangeEmail.value = true
}

function handleCloseChangeEmail() {
  isOpenedChangeEmail.value = false
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeProfile"
    class="layout"
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
            <div class="profile__user__roles w-100 flex-wrap">
              <div
                class="text-center border rounded-pill p-2 bg-light"
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
                <div class="d-grid w-100">
                  <Typography class-name=" text-secondary">Почта</Typography>
                  <div class="w-100 d-flex justify-content-between">
                    <Typography class-name="fs-5 ms-1">{{ user.email }}</Typography>
                    <Button
                      class-name="border bg-mutend rounded-pill"
                      @click="handleOpenChangeEmail"
                      >изменить почту</Button
                    >
                  </div>
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
                <Button
                  class-name="border bg-light rounded-pill"
                  @click="editSkillsHandler"
                  >изменить стек</Button
                >
              </div>

              <div
                class="profile__info__content p-2"
                v-if="editSkills == false"
              >
                <div
                  class="profile__info__content__skills border p-2 fs-5 rounded-4 bg-white"
                  v-for="skill in skills"
                  :key="skill"
                >
                  <Typography class-name="fs-5">{{ skill.name }}</Typography>
                  <Typography :class-name="skillLevel(skill.level)">{{
                    skill.level
                  }}</Typography>
                </div>
              </div>

              <div
                class="profile__info__content p-2"
                v-if="editSkills == true"
              >
                <div
                  class="profile__info__content__skills border p-2 fs-5 rounded-4 bg-white"
                  v-for="skill in skills"
                  :key="skill"
                >
                  <Typography class-name="fs-5">{{ skill.name }}</Typography>
                  <div class="d-flex">
                    <Select
                      name="component"
                      :options="[
                        { value: '123', label: 'Интересуюсь' },
                        { value: '231', label: 'Владею' },
                        { value: '231', label: 'Профессионал' },
                      ]"
                      v-tooltip="values.component"
                      placeholder="Выберите значение"
                    ></Select>
                  </div>
                </div>

                <StackCategories v-model="skills" />
                <div class="d-flex">
                  <Button
                    class-name="border bg-primary text-light rounded-pill"
                    @click="editSkillsClose"
                    >Сохранить</Button
                  >
                </div>
              </div>
            </div>

            <div class="w-100 bg-white border p-3 rounded-4">
              <div class="profile__info__header border-bottom pb-1">
                <Typography class-name="fs-4 text-primary">Проекты</Typography>
              </div>

              <div class="profile__info__content p-2">
                <div
                  class="profile__info__content__projects border w-100 px-1 pb-1 fs-5 rounded bg-white"
                  v-for="project in projects"
                  :key="project"
                >
                  <div class="d-flex justify-content-between w-100">
                    <Button class-name="fs-5">Проект: {{ project.name }}</Button>
                    <Button
                      prepend-icon-name="bi bi-caret-up text-primary text-opacity-75"
                      class-name="text-primary text-opacity-75"
                      v-collapse="project.id"
                      >описание</Button
                    >
                  </div>
                  <Collapse :id="project.id">
                    <Typography class-name="text-muted ms-3">{{
                      project.discription
                    }}</Typography>
                  </Collapse>
                </div>
              </div>
            </div>

            <div class="w-100 bg-white border p-3 rounded-4">
              <div class="profile__info__header border-bottom pb-1">
                <Typography class-name="fs-4 text-primary">Идеи</Typography>
              </div>
              <div class="profile__info__content p-2">
                <div
                  class="profile__info__content__projects border w-100 px-1 pb-1 fs-5 rounded-4 bg-white"
                  v-for="idea in ideas"
                  :key="idea"
                >
                  <div class="d-flex justify-content-between w-100">
                    <Button class-name="fs-5">Идея: {{ idea.name }}</Button>
                    <Button
                      prepend-icon-name="bi bi-caret-up text-primary text-opacity-75"
                      class-name="text-primary text-opacity-75"
                      v-collapse="idea.id"
                      >описание</Button
                    >
                  </div>
                  <Collapse :id="idea.id">
                    <Typography class-name="text-muted ms-4">{{
                      idea.discription
                    }}</Typography>
                  </Collapse>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangeEmailView
        :isOpened="isOpenedChangeEmail"
        @close-modal="handleCloseChangeEmail"
      >
      </ChangeEmailView>
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
