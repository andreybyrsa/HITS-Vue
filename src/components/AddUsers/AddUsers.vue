<script lang="ts" setup>
import { ref } from 'vue'

import Input from '@Components/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import Checkbox from '@Components/Checkbox/Checkbox.vue'

type Emails = string
type ActiveRoles = string

interface Users {
  emails: Emails[]
  roles: ActiveRoles[]
}

const fileContent = ref<string>('')
const rolesArray: ActiveRoles[] = ref([])
const usersArray: Users[] = ref([])
const emailsArray: Emails[] = ref([])

const addRole = (customValue: string) => {
  const index = rolesArray.value.indexOf(customValue)
  if (index === -1) {
    rolesArray.value.push(customValue)
  } else {
    rolesArray.value.splice(index, 1)
  }
}

const addUsers = () => {
  usersArray.value.push({
    emails: emailsArray,
    roles: rolesArray,
  })
}

const loadFile = () => {
  const file = (event.target as HTMLInputElement).files?.item(0)
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      fileContent.value = e.target?.result as string
      emailsArray.value = fileContent.value.split('\r\n')
    }
    reader.readAsText(file)
  }
}
</script>

<template>
  <Input
    type="file"
    class="w-100 my-2"
    placeholder="Выберите файл"
    @change="loadFile"
  />
  <Button
    type="button"
    class="w-100"
    data-bs-toggle="collapse"
    data-bs-target="#collapseExample"
    aria-expanded="false"
    aria-controls="collapseExample"
  >
    Выбрать роли
  </Button>
  <DropDown id="collapseExample"
    ><li class="px-2 list-group-item">
      <Checkbox
        label="Инициатор"
        @click="addRole('INITIATOR')"
      />
    </li>
    <li class="px-2 list-group-item">
      <Checkbox
        label="Эксперт"
        @click="addRole('EXPERT')"
      />
    </li>
    <li class="px-2 list-group-item">
      <Checkbox
        label="Проектный офис"
        @click="addRole('PROJECT_OFFICE')"
      />
    </li>
    <li class="px-2 list-group-item">
      <Checkbox
        v-if="$route.path.includes('/admin', 0)"
        label="Админ"
        @click="addRole('ADMIN')"
      />
    </li>
  </DropDown>
  <div class="button-center">
    <Button
      type="button"
      class-name="fs-6 text-primary mbutton"
      @click="$router.push('/admin/add/user')"
    >
      Добавить пользователя
    </Button>
  </div>
  <Button
    class-name="btn-primary"
    class="w-100"
    @click="addUsers"
  >
    Добавить
  </Button>
  <div
    v-for="users in usersArray"
    :key="users"
  >
    {{ users }}
  </div>
</template>

<style lang="scss">
.button-center {
  @include flexible(center, center, row);
}
</style>
