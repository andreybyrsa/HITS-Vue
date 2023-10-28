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

import useUserStore from '@Store/user/userStore'
import ExchangeModal from '@Components/Modals/ExchangeModal/ExchangeModal.vue'

const searchValue = ref('')
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'
import Team from '@Domain/Team'
import { Skill } from '@Domain/Skill'
import { Project } from '@Components/Modals/TeamModal/TeamAction.types'
import Input from '@Components/Inputs/Input/Input.vue'
import TeamMember from '@Domain/TeamMember'
const portfolio1: Project = {
  id: '1',
  name: 'Сервис позволяющий примерять одежду онлайн',
  description:
    'Данное решение имплементрует обученные нейросети для того, чтобы любой пользователь, который выбрал одежду из общего каталога, взятого с каталогов популярных магазинов одежды, и смог примерить ее по фото, подобрав свой размер, не выходя из дома',
}
const portfolio2: Project = {
  id: '2',
  name: 'Сайт управления идеями и проектами',
  description:
    'Данное решение поможет легче реализовывать идеи, решать проекты, подобрав для них команду',
}
const skillFron1: Skill = {
  id: 1,
  name: 'React',
  type: 'FRAMEWORK',
  confirmed: true,
}
const skillFron2: Skill = {
  id: 2,
  name: 'Vue',
  type: 'FRAMEWORK',
  confirmed: true,
}
const skillBack: Skill = {
  id: 3,
  name: 'Django',
  type: 'FRAMEWORK',
  confirmed: true,
}
const skillDB1: Skill = {
  id: 4,
  name: 'PostgreSQL',
  type: 'DATABASE',
  confirmed: true,
}
const skillDB2: Skill = {
  id: 5,
  name: 'SQLite',
  type: 'DATABASE',
  confirmed: true,
}
const skillDB3: Skill = {
  id: 6,
  name: 'MongoDB',
  type: 'DATABASE',
  confirmed: true,
}
const skillDEV1: Skill = {
  id: 7,
  name: 'Docker',
  type: 'DEVOPS',
  confirmed: true,
}
const skillDEV2: Skill = {
  id: 8,
  name: 'Git',
  type: 'DEVOPS',
  confirmed: true,
}
const skillDEV3: Skill = {
  id: 9,
  name: 'VSCode',
  type: 'DEVOPS',
  confirmed: true,
}
const skillLang1: Skill = {
  id: 10,
  name: 'Python',
  type: 'LANGUAGE',
  confirmed: true,
}
const skillLang2: Skill = {
  id: 11,
  name: 'JavaScript',
  type: 'LANGUAGE',
  confirmed: true,
}
const skillLang3: Skill = {
  id: 12,
  name: 'Java',
  type: 'LANGUAGE',
  confirmed: true,
}
const userOwner: TeamMember = {
  email: '123213@mail.com',
  firstName: 'Timur',
  lastName: 'Minyazeff',
  skills: [
    skillFron1,
    skillBack,
    skillDEV1,
    skillDEV2,
    skillDEV3,
    skillLang2,
    skillLang1,
    skillLang3,
    skillDB1,
    skillDB2,
  ],
}
const userLeader: TeamMember = {
  email: 'test2@gmail.com',
  firstName: 'Andrey',
  lastName: 'Byrsa',
  skills: [
    skillFron1,
    skillFron2,
    skillDEV1,
    skillDEV2,
    skillDEV3,
    skillLang2,
    skillLang1,
    skillLang3,
    skillDB1,
    skillDB2,
    skillDB3,
  ],
}
const user1: TeamMember = {
  email: 'test3@gmail.com',
  firstName: 'Mamed',
  lastName: 'Bairamov',
  skills: [
    skillFron1,
    skillFron2,
    skillLang1,
    skillDEV1,
    skillDEV2,
    skillDEV3,
    skillDB3,
  ],
}
const user2: TeamMember = {
  email: 'test4@gmail.com',
  firstName: 'Kirill',
  lastName: 'Vlasiv',
  skills: [skillFron2, skillLang2, skillDEV1, skillDEV2, skillDEV3, skillFron1],
}
const team: Team = {
  id: 0,
  name: 'Разработчики',
  description: 'Группа разработки вебсайтов',
  createdAt: new Date(20, 20, 20),
  owner: userOwner,
  leader: userLeader,
  members: [user1, user2, userLeader, userOwner],
  skills: [
    skillBack,
    skillFron1,
    skillFron2,
    skillDEV1,
    skillDEV2,
    skillDEV3,
    skillDB1,
    skillDB2,
    skillDB3,
    skillLang1,
    skillLang2,
    skillLang3,
  ],
  closed: false,
  projects: [portfolio1, portfolio2],
}
const openModal = ref(false)
function handleCloseIdeaModal() {
  openModal.value = false
}

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
