<script lang="ts" setup>
import { Ref, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import TypographyVue from '@Components/Typography/Typography.vue'
import PageLayoutVue from '@Layouts/PageLayout/PageLayout.vue'
import InputVue from '@Components/Input/Input.vue'
import ButtonVue from '@Components/Button/Button.vue'
import useUserStore from '@Store/user/userStore'

const userData = reactive({
  username: '',
  password: '',
})

interface InputTypes {
  key: 'username' | 'password'
  value: typeof userData
  placeholder: string
}

interface UserTypes {
  username: string
  password: string
}

const inputs: Ref<InputTypes[]> = ref([
  { key: 'username', value: userData, placeholder: 'Введите логин' },
  { key: 'password', value: userData, placeholder: 'Введите пароль' },
])

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function handleLogin(user: UserTypes) {
  userStore.loginUser(user)
}
</script>

<template>
  <PageLayoutVue content-class-name="log-page__content p-3">
    <template #content>
      {{ user }}
      <div class="log-page__form card card-body">
        <TypographyVue class-name="fs-3 text-primary">
          Авторизация
        </TypographyVue>
        <InputVue
          v-for="input in inputs"
          v-model="input.value[input.key]"
          :placeholder="input.placeholder"
          :key="input.key"
        />
        <ButtonVue
          @click="handleLogin(userData)"
          class-name="btn-primary w-100"
          >Войти</ButtonVue
        >
      </div>
    </template>
  </PageLayoutVue>
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
