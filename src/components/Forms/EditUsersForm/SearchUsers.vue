<script lang="ts" setup>
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'

import RolesTypes from '@Domain/Roles'

import getRoles from '@Utils/getRoles'
import DropDown from '@Components/DropDown/DropDown.vue'

const availableRoles = getRoles()

const searchedValue = defineModel<string>('searchedValue', {
  required: true,
})
const filteredRoles = defineModel<RolesTypes[]>('filteredRoles', {
  required: true,
})
</script>

<template>
  <div class="w-50">
    <Input
      name="search"
      v-model="searchedValue"
      placeholder="Поиск по почте"
    >
      <template #append>
        <Button
          class-name="px-2 py-0"
          append-icon-name="bi bi-chevron-down"
          v-dropdown:keepOpen="'searchUsers'"
        >
          Роли
        </Button>
        <DropDown id="searchUsers">
          <template
            v-for="(role, index) in availableRoles.roles"
            :key="index"
          >
            <Checkbox
              name="checkboxRole"
              :label="availableRoles.translatedRoles[role]"
              v-model="filteredRoles"
              :value="role"
            />
          </template>
        </DropDown>
      </template>
    </Input>
  </div>
</template>
