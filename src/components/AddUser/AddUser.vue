<script lang="ts" setup>
import { ref } from 'vue'

import Input from '@Components/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import Checkbox from '@Components/Checkbox/Checkbox.vue'

let userModel = ''
type ActiveRoles = string

interface User {
  email: string
  roles: ActiveRoles[]
}

const rolesArray: ActiveRoles[] = ref([])
const userArray: User[] = ref([])

const addRole = (customValue: string) => {
  const index = rolesArray.value.indexOf(customValue)
  if (index === -1) {
    rolesArray.value.push(customValue)
  } else {
    rolesArray.value.splice(index, 1)
  }
}

const addUser = () => {
  userArray.value.push({
    email: userModel,
    roles: rolesArray,
  })
}
</script>

<template>
  <Input
    type="email"
    class="w-100 my-2"
    placeholder="Введите email"
    v-model:value="userModel"
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
      @click="$router.push('/admin/add/users')"
    >
      Добавить пользователей
    </Button>
  </div>
  <Button
    v-if="$route.name == 'addUser'"
    class-name="btn-primary"
    class="w-100"
    @click="addUser"
  >
    Добавить
  </Button>
  <div
    v-for="user in userArray"
    :key="user"
  >
    {{ user }}
  </div>
</template>

<style lang="scss">
.button-center {
  @include flexible(center, center, row);
}
</style>
