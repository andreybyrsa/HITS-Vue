<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import NavTab from '@Components/NavTab/NavTab.vue'
import IdeaModal from '@Components/Modals/IdeaModal/IdeaModal.vue'
import Table from '@Components/Table/Table.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import useUserStore from '@Store/user/userStore'

import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'
import Team from '@Domain/Team'
import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Portfolio } from '@Components/Modals/TeamModal/TeamAction.types'

const portfolio1: Portfolio = {
  id: '1',
  name: 'Сервис позволяющий примерять одежду онлайн',
  description:
    'Данное решение имплементрует обученные нейросети для того, чтобы любой пользователь, который выбрал одежду из общего каталога, взятого с каталогов популярных магазинов одежды, и смог примерить ее по фото, подобрав свой размер, не выходя из дома',
}

const portfolio2: Portfolio = {
  id: '2',
  name: 'Сайт управления идеями и проектами',
  description:
    'Данное решение поможет легче реализовывать идеи, решать проекты, подобрав для них команду',
}

const skillFron: Skill = {
  id: '1236',
  name: 'React',
  type: 'FRAMEWORK',
  confirmed: true,
}

const skillBack: Skill = {
  id: '1236',
  name: 'Django',
  type: 'FRAMEWORK',
  confirmed: true,
}

const skillDB: Skill = {
  id: '1236',
  name: 'PostgreSQL',
  type: 'DATABASE',
  confirmed: true,
}

const skillDEV: Skill = {
  id: '1236',
  name: 'Docker',
  type: 'DEVOPS',
  confirmed: true,
}

const skillLang1: Skill = {
  id: '1236',
  name: 'Python',
  type: 'LANGUAGE',
  confirmed: true,
}

const skillLang2: Skill = {
  id: '1236',
  name: 'JavaScript',
  type: 'LANGUAGE',
  confirmed: true,
}

const userOwner: User = {
  id: '651d796443862a3293d5e872',
  email: 'test1@gmail.com',
  firstName: 'Timur',
  lastName: 'Minyazeff',
  roles: ['ADMIN', 'EXPERT', 'INITIATOR', 'PROJECT_OFFICE'],
  skills: [skillBack, skillDEV, skillLang1, skillDB],
}

const userLeader: User = {
  id: '1234',
  email: 'test2@gmail.com',
  firstName: 'Andrey',
  lastName: 'Byrsa',
  roles: ['ADMIN', 'EXPERT', 'INITIATOR', 'PROJECT_OFFICE'],
  skills: [skillFron, skillDEV, skillLang2, skillLang1, skillDB],
}

const user1: User = {
  id: '1235',
  email: 'test3@gmail.com',
  firstName: 'Mamed',
  lastName: 'Bairamov',
  roles: ['ADMIN', 'EXPERT', 'INITIATOR', 'PROJECT_OFFICE'],
  skills: [skillFron, skillLang1, skillDEV],
}

const user2: User = {
  id: '1236',
  email: 'test4@gmail.com',
  firstName: 'Kirill',
  lastName: 'Vlasiv',
  roles: ['ADMIN', 'EXPERT', 'INITIATOR', 'PROJECT_OFFICE'],
  skills: [skillFron, skillLang2, skillDEV],
}

const team: Team = {
  id: 'bestTeam',
  name: 'Разработчики',
  description: 'Группа разработки вебсайтов',
  owner: userOwner,
  leader: userLeader,
  members: [user1, user2, userLeader, userOwner],
  skills: [skillBack, skillFron, skillDEV, skillDB, skillLang1, skillLang2],
  isAvailable: true,
  portfolio: [portfolio1, portfolio2],
}

const openModal = ref(false)

function handleCloseIdeaModal() {
  openModal.value = false
}

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

const selectedOption = ref()

userStore.checkLastActivity()

const { values, handleSubmit } = useForm({
  validationSchema: {
    component: (value: string) => value?.length || 'Обязательно к заполнению',
  },
  initialValues: {
    combobox: [],
    component: '',
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

      <TeamModal
        :is-opened="openModal"
        @close-modal="handleCloseIdeaModal"
        :team="team"
      ></TeamModal>

      <Button
        @click="openModal = true"
        class-name="btn-primary"
        append-icon-name="bi bi-plus-lg"
        >Открыть команду</Button
      >

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
