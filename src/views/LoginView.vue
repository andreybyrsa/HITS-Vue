<script lang="ts" setup>
import { Ref, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Typography from '@Components/Typography/Typography.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Input from '@Components/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import useUserStore from '@Store/user/userStore'
import { LoginUser } from '@Domain/User'

const userData = reactive({
  username: '',
  password: '',
})

interface InputTypes {
  key: 'username' | 'password'
  value: typeof userData
  placeholder: string
  prepend?: string
  prependIcon?: string
}

const inputs: Ref<InputTypes[]> = ref([
  {
    key: 'username',
    value: userData,
    placeholder: 'Введите логин',
    prepend: '@',
  },
  {
    key: 'password',
    value: userData,
    placeholder: 'Введите пароль',
    prependIcon: 'bi bi-key-fill',
  },
])

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function handleLogin(user: LoginUser) {
  userStore.loginUser(user)
}
</script>

<template>
  <PageLayout content-class-name="log-page__content p-3">
    <template #content>
      {{ user }}
      <div class="log-page__form card card-body">
        <Typography class-name="fs-3 text-primary"> Авторизация </Typography>
        <Input
          v-for="input in inputs"
          v-model="input.value[input.key]"
          :placeholder="input.placeholder"
          :key="input.key"
          :prepend="input.prepend"
        >
          <template #prepend>
            <i :class="input.prependIcon"></i>
          </template>
        </Input>
        <Button
          @click="handleLogin(userData)"
          class-name="btn-primary w-100"
        >
          Войти
        </Button>
      </div>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.log-page {
  &__content {
    @include flexible(center, center);
  }
  &__form {
    @include flexible(center, flex-start, column, $gap: 25px);
    max-width: 400px;
  }
}
</style>
