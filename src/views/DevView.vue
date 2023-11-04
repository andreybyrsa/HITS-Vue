<script lang="ts" setup>
import { onMounted, ref } from 'vue'
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
import ExchangeModal from '@Components/Modals/ExchangeModal/ExchangeModal.vue'

import Input from '@Components/Inputs/Input/Input.vue'
import TeamService from '@Services/TeamService'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await TeamService.getTeams(token)

    console.log(response)
  }
})

const columns = [
  { key: 'number', label: '#' },
  { key: 'date', label: 'Дата' },
  { key: 'who', label: 'Кто' },
  { key: 'doing', label: 'Что сделал' },
  { key: 'name', label: 'Где' },
]

const data = [
  {
    number: 1,
    date: '11-11-2001',
    who: 'Victor',
    doing: 'сломався',
    name: 'в идее номер 1338 в идее номер 1338 в идее номер 1338 в идее номер 1338 в идее номер 1338 в идее номер 1338',
  },
  {
    number: 2,
    date: '11-11-2001',
    who: 'Victor',
    doing: 'сломався',
    name: 'в идее номер 1338',
  },
  {
    number: 3,
    date: '11-11-2001',
    who: 'Victor',
    doing: 'сломався',
    name: 'в идее номер 1338',
  },
  {
    number: 4,
    date: '11-11-2001',
    who: 'Victor',
    doing: 'сломався',
    name: 'в идее номер 1338',
  },
]

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isOpenedModal = ref(false)

const switchButton = ref<boolean>(false)

function switchContent() {
  switchButton.value ? (switchButton.value = false) : (switchButton.value = true)
}

userStore.checkLastActivity()

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

function handleCloseModal() {
  isOpenedModal.value = false
}
</script>

<template>
  <PageLayout content-class-name="dev-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <Button @click="switchContent"> Проверка KeepAlive </Button>
      <KeepAlive>
        <Input
          v-if="switchButton"
          name="первый"
        >
        </Input>
      </KeepAlive>
      <Input
        v-if="!switchButton"
        name="второй"
      >
      </Input>

      <Button
        @click="router.push('/teams/list/1')"
        class-name="btn-primary"
        append-icon-name="bi bi-plus-lg"
        >Открыть команду</Button
      >

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
        class-name="btn-primary"
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
        class-name="btn-primary"
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

      <ExchangeModal
        :is-opened="isOpenedModal"
        @close-modal="handleCloseModal"
      />

      <Button
        class-name="btn-primary"
        @click="isOpenedModal = true"
      >
        Открыть окно
      </Button>

      <pre>Пользователь из userStore - {{ user }}</pre>
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
