<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Typography from '@Components/Typography/Typography.vue'
import NavTab from '@Components/NavTab/NavTab.vue'
import IdeaModal from '@Components/Modals/IdeaModal/IdeaModal.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Table from '@Components/Table/Table.vue'

import useUserStore from '@Store/user/userStore'

import Validation from '@Utils/Validation'
import { Idea } from '@Domain/Idea'
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

const text = ref('')
const isOpenedModal = ref(false)

userStore.checkLastActivity()

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
      <Typography class-name="fs-2 text-primary">Dev Page</Typography>

      <Button
        class-name="btn-primary"
        append-icon-name="bi bi-plus-lg"
        @click="handleLogin"
      >
        Логин
      </Button>

      <Input
        name="email"
        v-model="text"
        :validation="Validation.checkEmail"
        prepend="текст"
        placeholder="Введите текст"
      />

      <div class="nav nav-pills">
        <NavTab
          icon-name="bi bi-list"
          to="/ideas"
          is-active
        >
          Перейти на Ideas
        </NavTab>
      </div>

      <IdeaModal
        :is-opened="isOpenedModal"
        @close-modal="handleCloseModal"
      />

      <Button
        class-name="btn-warning"
        @click="isOpenedModal = true"
      >
        Открыть окно
      </Button>

      <pre class="sss">Пользователь из userStore - {{ user }}</pre>

      <Input
        name="asd"
        v-model="searchValue"
        placeholder="Поиск журнала по названию"
      >
        <template #prepend>
          <i class="bi bi-search"></i>
        </template>
      </Input>

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
