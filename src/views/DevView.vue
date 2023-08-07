<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Typography from '@Components/Typography/Typography.vue'
import NavTab from '@Components/NavTab/NavTab.vue'
import RoleModal from '@Components/Modals/RoleModal/RoleModal.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const text = ref('')
const isOpenedModal = ref(false)

userStore.checkLastActivity()

function handleLogin() {
  userStore.loginUser({ email: 'new2@mail.com', password: '12345' })
}
</script>

<template>
  <PageLayout content-class-name="dev-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <Typography class-name="fs-2 text-primary">Dev Page</Typography>

      <Button
        class-name="btn-primary"
        icon-name="bi bi-plus-lg"
        @click="handleLogin"
      >
        Логин
      </Button>

      <Input
        v-model="text"
        prepend="текст"
        placeholder="Введите текст"
      />
      {{ text }}

      <div class="nav nav-pills">
        <NavTab
          icon-name="bi bi-list"
          to="/ideas"
          is-active
        >
          Перейти на Ideas
        </NavTab>
      </div>

      <Button
        class-name="btn-warning"
        @click="isOpenedModal = true"
        >Открыть окно</Button
      >
      <Transition name="bounce">
        <p style="text-align: center">Hello here is some bouncy text!</p>
      </Transition>

      <RoleModal
        :is-opened="isOpenedModal"
        @close-modal="isOpenedModal = false"
      />

      <pre>Пользователь из userStore - {{ user }}</pre>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.dev-page {
  &__content {
    @include flexible(flex-start, flex-start, column, $gap: 16px);
  }
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
