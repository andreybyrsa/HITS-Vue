<script lang="ts" setup>
import { reactive, ref } from 'vue'

import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'

const email = ref('')
const toggle = ref(true)

const newUser = reactive({
  email: '',
  file: null,
  roles: [],
})
const addRole = (role: string) => {
  const index = newUser.roles.indexOf(role)
  if (index === -1) {
    newUser.roles.push(role)
  } else {
    newUser.roles.splice(index, 1)
  }
}
const addUser = () => {
  console.log('user added')
}
</script>

<template>
  <Input
    :type="toggle ? 'email' : 'file'"
    class="my-2"
    placeholder="Введите email"
    v-model="email"
    @input="toggle ? (newUser.email = email) : (newUser.file = email)"
  />
  <div class="button-center">
    <Button
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#collapseExample"
      aria-expanded="false"
      aria-controls="collapseExample"
    >
      Выбрать роли
    </Button>
  </div>
  <DropDown id="collapseExample"
    ><li class="px-2 list-group-item">
      <Checkbox
        label="Инициатор"
        v-model="newUser.roles"
        value="INITIATOR"
      />
    </li>
    <li class="px-2 list-group-item">
      <Checkbox
        label="Эксперт"
        v-model="newUser.roles"
        value="EXPERT"
      />
    </li>
    <li class="px-2 list-group-item">
      <Checkbox
        label="Проектный офис"
        v-model="newUser.roles"
      />
    </li>
    <li class="px-2 list-group-item">
      <Checkbox
        v-if="$route.path.includes('/admin', 0)"
        label="Админ"
        v-model="newUser.roles"
      />
    </li>
  </DropDown>
  <div class="button-center">
    <Button
      type="button"
      class-name="fs-6 text-primary mbutton"
      @click="toggle = !toggle"
    >
      <div v-if="toggle">Добавить пользователей</div>
      <div v-if="!toggle">Добавить пользователя</div>
    </Button>
  </div>
  <Button
    class-name="btn-primary"
    class="w-100"
    @click="addUser"
  >
    Добавить
  </Button>
  <div>
    {{ newUser }}
  </div>
</template>

<style lang="scss">
.button-center {
  @include flexible(center, center, row);
}
</style>
