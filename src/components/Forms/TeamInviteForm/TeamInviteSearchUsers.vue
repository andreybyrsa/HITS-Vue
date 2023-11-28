<template>
  <div class="search-users border rounded-4">
    <div class="d-flex w-100 p-2 px-3 gap-3">
      <div class="search-users__main gap-3">
        <div class="w-100">
          <Input
            name="search"
            class-name="rounded-end"
            no-form-controlled
            placeholder="Поиск"
          >
            <template #prepend>
              <Icon class-name="bi bi-search" />
            </template>
          </Input>
        </div>

        <div>
          <Button
            v-for="(user, index) in users"
            :key="index"
            @click="addUserToParent(user)"
            class="search-users__element p-1"
          >
            <img
              src="https://static.thenounproject.com/png/363640-200.png"
              alt="avatar"
              class="h-100"
            />

            <div>
              {{ user.firstName }}
              {{ user.lastName }}
            </div>
          </Button>
        </div>
      </div>

      <FilterBar
        v-if="filters"
        class-name="ms-2 border-start"
        :filters="filters"
      />
    </div>

    <div
      class="search-users__invite gap-2 w-100 bg-light rounded-bottom-4 border p-3"
    >
      <Icon class-name="bi bi-plus-circle-fill fs-3 text-primary"></Icon>
      <Typography class-name="fs-4 text-primary">Пригласить на портал </Typography>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue'
import { User } from '@Domain/User'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Icon from '@Components/Icon/Icon.vue'
import FilterBar from '@Components/FilterBar/FilterBar.vue'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import RolesTypes from '@Domain/Roles'
import Typography from '@Components/Typography/Typography.vue'

const users = inject<User[]>('users')

const rolesFilter = ref<RolesTypes[]>([])

const emits = defineEmits(['addUser'])

const addUserToParent = (user: User) => {
  emits('addUser', user)
}

const filters: Filter<User>[] = [
  {
    category: 'Роли',
    choices: [
      { label: 'Инициатор', value: 'INITIATOR' },
      { label: 'Проектный офис', value: 'PROJECT_OFFICE' },
      { label: 'Эксперт', value: 'EXPERT' },
      { label: 'Админ', value: 'ADMIN' },
    ],
    refValue: rolesFilter,
    isUniqueChoice: false,
    checkFilter: checkUserRoles,
  },
]

function checkUserRoles(user: User, role: FilterValue) {
  return user.roles.find((userRole) => userRole === role)
}
</script>

<style lang="scss" scoped>
.search-users {
  width: 75%;
  @include flexible(start, space-between, column);

  &__main {
    width: 70%;
    @include flexible(start, center, column);
  }

  &__element {
    height: 50px;
    width: fit-content;
    margin-bottom: 8px;
    @include flexible(center, start, $gap: 8px);
  }

  &__element:hover {
    background-color: rgb(228, 228, 228);
    border-radius: 24px;
  }

  &__invite {
    @include flexible(center, start);
  }
}
</style>
