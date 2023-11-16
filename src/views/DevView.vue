<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import NavTab from '@Components/NavTab/NavTab.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isOpenedModal = ref(false)

const { values, handleSubmit } = useForm({
  validationSchema: {
    component: (value: string) => value?.length || 'Обязательно к заполнению',
  },
  initialValues: {
    combobox: [],
    component: undefined,
  },
})

const fieldSubmit = handleSubmit((values) => console.log(values))

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
      <div class="table-responsive"></div>

      <Select
        name="component"
        :options="[
          { value: '123', label: '1' },
          { value: '231', label: '1' },
        ]"
        v-tooltip="values.component"
        placeholder="Выберите значение"
      ></Select>
      <Button
        type="submit"
        variant="primary"
        @click="fieldSubmit"
      >
        Submit
      </Button>

      {{ values }}

      <Combobox
        name="combobox"
        :options="[
          { lang: 'Java', name: 'Джава' },
          { lang: 'React', name: 'Реакт' },
          { lang: 'Vue', name: 'Вью' },
          { lang: 'Mongo DB', name: 'Монго ДБ' },
        ]"
        :display-by="['lang']"
        label="Стек"
        placeholder="Выберите стек технологий"
      />

      <Button
        variant="primary"
        append-icon-name="bi bi-plus-lg"
        @click="handleLogin"
      >
        Логин
      </Button>

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
        variant="primary"
        @click="isOpenedModal = true"
      >
        Открыть окно
      </Button>

      <pre class="sss">Пользователь из userStore - {{ user }}</pre>
    </template>
  </PageLayout>
</template>

<style lang="scss" scoped>
.dev-page {
  &__content {
    @include flexible(flex-start, flex-start, column, $gap: 16px);
  }
}
</style>
