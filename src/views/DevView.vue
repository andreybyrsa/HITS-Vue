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

import Input from '@Components/Inputs/Input/Input.vue'
import TeamService from '@Services/TeamService'
import { useRouter } from 'vue-router'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'

const router = useRouter()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await TeamService.getTeams(token)

    console.log(response)
  }
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isOpenedModal = ref(false)

const switchButton = ref<boolean>(false)

function switchContent() {
  switchButton.value ? (switchButton.value = false) : (switchButton.value = true)
}

const { values, handleSubmit } = useForm({
  validationSchema: {
    component: (value: string) => value?.length || 'Обязательно к заполнению',
  },
  initialValues: {
    combobox: undefined,
    component: undefined,
  },
})

const fieldSubmit = handleSubmit((values) => console.log(values))

function handleLogin() {
  userStore.loginUser({ email: 'new2@mail.com', password: '12345' })
}

const a = ref([{ id: '1', lang: 'React' }])
</script>

<template>
  <PageLayout content-class-name="dev-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <router-view></router-view>
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
      >
        Открыть команду
      </Button>

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
        name="1"
        :options="[
          { id: '0', lang: 'Java', name: 'Джава' },
          { id: '1', lang: 'React', name: 'Реакт' },
          { id: '2', lang: 'Vue', name: 'Вью' },
          { id: '3', lang: 'Mongo DB', name: 'Монго ДБ' },
        ]"
        :display-by="['lang']"
        comparing-key="id"
        v-model="a"
        label="Стек"
        placeholder="Выберите стек технологий"
      />
      {{ a }}

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
