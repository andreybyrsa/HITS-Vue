<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import NavTab from '@Components/NavTab/NavTab.vue'
import Table from '@Components/Table/Table.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import JoinIdeaModal from '@Components/Modals/JoinIdeaModal/JoinIdeaModal.vue'

import useUserStore from '@Store/user/userStore'
import ExchangeModal from '@Components/Modals/ExchangeModal/ExchangeModal.vue'

const searchValue = ref('')

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
const isOpenedJoinModal = ref(false)

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

function handleCloseJoinModal() {
  isOpenedJoinModal.value = false
}
</script>

<template>
  <PageLayout content-class-name="dev-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <Typography class-name="fs-2 text-primary">Dev Page</Typography>

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

      <JoinIdeaModal
        :is-opened="isOpenedJoinModal"
        @close-modal="handleCloseJoinModal"
      />

      <Button
        class-name="btn-primary"
        @click="isOpenedModal = true"
      >
        Открыть окно
      </Button>

      <pre class="sss">Пользователь из userStore - {{ user }}</pre>

      <Table
        :columns="columns"
        :data="data"
        :search-value="searchValue"
        :filter-value="columns[0].key"
      >
        <template #actions="{ item }">
          <div>
            <Button
              class-name=" btn-primary text-white  fs-3  "
              prepend-icon-name="bi bi-list"
              >{{ item.number }}</Button
            >
          </div>
        </template>
      </Table>
      <Button
        class-name="w-100 bg-primary text-light rounded-pill"
        @click="isOpenedJoinModal = true"
      >
        Подать заявку
      </Button>
    </template>
  </PageLayout>
</template>

<style lang="scss" scoped>
.dev-page {
  &__content {
    @include flexible(flex-start, flex-start, column, $gap: 16px);
  }
}

.sss {
  width: 500px;
}
</style>
