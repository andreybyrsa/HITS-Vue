<script lang="ts" setup>
import { reactive, Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Input/Input.vue'
import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'

const userData = reactive({
  username: 'kirill.vlasov.05@inbox.ru',
  firstName: '',
  lastName: '',
  password: '',
  token: '',
  roles: ['INITIATOR'],
  role: 'INITIATOR',
})

interface InputTypes {
  key: 'username' | 'firstName' | 'lastName' | 'password'
  model: typeof userData
  placeholder: string
  icon: string
  type: string
}

interface UserTypes {
  username: string
  firstName: string
  lastName: string
  password: string
  token: string
  roles: string[]
  role: string
}

const inputs: Ref<InputTypes[]> = ref([
  {
    key: 'username',
    model: userData,
    placeholder: 'Введите почту',
    icon: 'bi bi-at',
    type: 'text',
  },
  {
    key: 'firstName',
    model: userData,
    placeholder: 'Введите имя',
    icon: 'bi bi-person',
    type: 'text',
  },
  {
    key: 'lastName',
    model: userData,
    placeholder: 'Введите фамилию',
    icon: 'bi bi-person',
    type: 'text',
  },
  {
    key: 'password',
    model: userData,
    placeholder: 'Введите пароль',
    icon: 'bi bi-lock',
    type: 'password',
  },
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
          v-model="input.model[input.key]"
          :placeholder="input.placeholder"
          :key="input.key"
          :prepend="input.icon"
          :type="input.type"
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
