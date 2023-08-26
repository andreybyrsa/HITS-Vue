<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import AddExpertGroup from '@Components/Modals/AddExpertGroupModal/AddExpertGroupModal.vue'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import { User } from '@Domain/User'
import GroupService from '@Services/GroupsService'
import ManageUsersService from '@Services/ManageUsersService'
import useNotification from '@Hooks/useNotification'

import { AddExpertGroupModalProps } from '@Components/Modals/AddExpertGroupModal/AddExpertGroupModal.types'
import UserGroup from '@Domain/Group'
import Collapse from '@Components/Collapse/Collapse.vue'

const searchedValue = ref('')

const isOpenedAddGroup = ref(false)
const currentAddExpertGroup = ref([] as string[])

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const props = defineProps<AddExpertGroupModalProps>()
const usersarray = ref<User[]>([])

const {
  notificationOptions,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

function openAddGroupModal() {
  isOpenedAddGroup.value = true
}

function closeAddGroupModal() {
  isOpenedAddGroup.value = false
}

const usersGroup = ref<UserGroup[]>([])

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseUsers = await ManageUsersService.getUsers(token)
    const responseGroups = await GroupService.getUsersGroups(token)

    if (responseUsers instanceof Error) {
      return handleOpenNotification('error', responseUsers.message)
    }
    if (responseGroups instanceof Error) {
      return handleOpenNotification('error', responseGroups.message)
    }

    usersarray.value = responseUsers.users
    usersGroup.value = responseGroups
  }
})

const searchedGroupAndUsers = computed(() => {
  return usersarray.value.filter((groups) => {
    const name = AddExpertGroup.nameOfGroup?.toLowerCase().trim()
    const currentSearchedValue = searchedValue.value?.toLowerCase().trim()

    const isIncludesSearcheValue = name?.includes(currentSearchedValue)

    return isIncludesSearcheValue
  })
})

const isOpenedCollapse = ref(true)

function openCollapse() {
  isOpenedCollapse.value = !isOpenedCollapse.value
}

const visible = ref(true)
//const searchedGroupAndUsers[] = ManageUsersService.getUsersGroup(user.value?.token as string)
</script>

<template>
  <FormLayout class-name="users-group-form p-3">
    <Typography class-name="fs-2 text-primary text-center w-100"
      >Группы пользователей</Typography
    >
    {{ usersarray }}
    <div class="w-50">
      <Input
        name="search"
        v-model="searchedValue"
        placeholder="Поиск группы пользователей"
      >
        <template #append>
          <Button
            class-name="px-2 py-0"
            @click="openAddGroupModal"
            prepend-icon-name="bi bi-plus-lg"
            >Добавить группу
          </Button>
        </template>
      </Input>
      <div v-if="isOpenedAddGroup">
        <AddExpertGroup
          :isOpened="isOpenedAddGroup"
          :currentAddExpertGroup="currentAddExpertGroup"
          @close-modal="closeAddGroupModal"
          :usersarray="usersarray"
          v-model="usersGroup"
        >
        </AddExpertGroup>
      </div>
    </div>
    <div class="users-group-form__contetnt w-100">
      <div
        v-for="(users, index) in usersGroup"
        :key="index"
        class="edit-users-form__group px-3 py-2 border rounded-3 mb-2 accordion"
      >
        <!-- <Button
          :id="index.toString()"
          is-collapse-controller
        >
          {{ users.name }}
        </Button>
        <Collapse
          :id="index.toString()"
          class="mt-2"
        >
          <div>
            <Typography class-name="m-2">{{ user.lastName }}</Typography>
            <Typography>{{ user.firstName }}</Typography>
          </div>
        </Collapse> -->
      </div>
    </div>
    <div class="users-group-form w-100">
      <div
        v-for="(group, index) in searchedGroupAndUsers"
        :key="index"
        class="users-group-form__group px-3 py-2 border rounded-3"
      >
        <div class="d-flex flex-column">
          <Typography class-name="text-primary fs-5">
            {{ usersGroup }}
          </Typography>
        </div>
      </div>

      <!--<Button
        prepend-icon-name="bi bi-pencil-square text-primary"
        @click="handleOpenModal(user.email)"
      ></Button>-->
    </div>
  </FormLayout>
</template>

<style lang="scss" scoped>
.users-group-form {
  width: 100%;
  height: 100%;
  background-color: $white-color;

  @include flexible(center, flex-start, column, $gap: 16px);

  &__content {
    max-height: 100%;

    overflow-y: scroll;

    @include flexible(stretch, flex-start, column, $gap: 8px);
  }
  &__group {
    @include flexible(center, space-between);
  }
}
</style>
