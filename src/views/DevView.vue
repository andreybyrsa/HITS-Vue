<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Input/Input.vue'
import Typography from '@Components/Typography/Typography.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const text = ref('')

function handleLogin() {
  userStore.loginUser('AndreyByrsa')
}
</script>

<template>
  <PageLayout content-class-name="dev-page__content p-3">
    <template #leftSideBar>
      <Button class-name="btn-warning">Кнопка в SideBar</Button>

      <pre>Пользователь из userStore - {{ user }}</pre>
    </template>

    <template #content>
      <Typography class-name="fs-2 text-primary">Dev Page</Typography>

      <Button
        class-name="btn-primary"
        icon-name="bi bi-plus-lg"
        @click="handleLogin"
      >
        Кнопка
      </Button>

      <Input
        v-model="text"
        placeholder="Введите текст"
      />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.dev-page {
  &__content {
    @include flexible(flex-start, flex-start, column, $gap: 16px);
  }
}
</style>
