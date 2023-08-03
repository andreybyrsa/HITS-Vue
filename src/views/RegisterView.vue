<script lang="ts" setup>
import { reactive, Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Input/Input.vue'
import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'

const userData = reactive({
  username: '',
  firstName: '',
  lastName: '',
  password: '',
})

interface InputTypes {
  key: 'username' | 'firstName' | 'lastName' | 'password'
  value: typeof userData
  placeholder: string
}

interface UserTypes {
  username: string
  firstName: string
  lastName: string
  password: string
}

const inputs: Ref<InputTypes[]> = ref([
  { key: 'username', value: userData, placeholder: 'Введите логин' },
  { key: 'firstName', value: userData, placeholder: 'Введите имя' },
  { key: 'lastName', value: userData, placeholder: 'Введите фамилию' },
  { key: 'password', value: userData, placeholder: 'Введите пароль' },
])

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function handleRegister(user: UserTypes) {
  userStore.registerUser(user)
}
</script>

<template>
  <PageLayout content-class-name="reg-page__content p-3">
    <template #content>
      {{ user }}
      <div class="reg-page__form card card-body">
        <Typography class-name="fs-3 text-primary">Регистрация</Typography>
        <Input
          v-for="input in inputs"
          v-model="input.value[input.key]"
          :placeholder="input.placeholder"
          :key="input.key"
        />
        <Button
          @click="handleRegister(userData)"
          class-name="btn-primary w-100"
        >
          Зарегистрироваться
        </Button>
      </div>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.reg-page {
  &__content {
    @include flexible(center, center);
  }
  &__form {
    @include flexible(center, flex-start, column, $gap: 20px);
    max-width: 400px;
  }
}
</style>
