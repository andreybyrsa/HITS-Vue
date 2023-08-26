<script lang="ts" setup>
import { ref, watch } from 'vue'
import {
  AddExpertGroupModalProps,
  AddExpertGroupModalEmits,
} from '@Components/Modals/AddExpertGroupModal/AddExpertGroupModal.types'
import VueMultiselect from 'vue-multiselect'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'

import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import { User } from '@Domain/User'
import UserGroup from '@Domain/Group'

import useNotification from '@Hooks/useNotification'

import { useFieldArray, useForm } from 'vee-validate'
import { UserGroupData } from '@Domain/ManageUsers'
import GroupService from '@Services/GroupsService'

const props = defineProps<AddExpertGroupModalProps>()
const emit = defineEmits<AddExpertGroupModalEmits>()

const groups = defineModel<UserGroup[]>({ required: true })

const selectedUsers = ref<User[]>([])
const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const {
  notificationOptions,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

const { fields, push, remove } = useFieldArray<User>('user')

const removeUser = (user: User) => {
  const index = selectedUsers.value.indexOf(user)
  if (index !== -1) {
    selectedUsers.value.splice(index, 1)
  }
}

watch(selectedUsers, (newSelectedUsers) => {
  setValues({ ...values, users: newSelectedUsers })
})

const { errors, setValues, handleSubmit, values } = useForm<UserGroupData>({
  validationSchema: {
    name: (value: string) => value?.length > 0 || 'Поле не заполнено',
    users: (value: User[]) => value?.length > 0 || 'Выберите пользователя',
  },
})

const handleCreate = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await GroupService.createUsersGroup(values, token)
    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }
    handleOpenNotification('success', response.success)
    emit('close-modal')
    groups.value.push(values)
  }
})

//const fullName = ref([user.value?.firstName, user.value?.lastName])
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="add-expert-group-modal p-3 bg-white rounded-3">
      <div class="add-expert-group-modal__header">
        <Typography class-name="fs-2 text-primary">Добавить группу</Typography>
        <Button
          class-name="btn-close"
          @click="emit('close-modal')"
        ></Button>
      </div>
      <Input
        name="name"
        class-name="fs-6 h-50"
        placeholder="Введите название группы"
      />
      <!-- <VueMultiselect
        v-model="selectedUsers"
        :options="props.usersarray"
        label="lastName"
        multiple
        track-by="email"
        placeholder="Выберите пользователя"
      ></VueMultiselect>

      <ul class="list-group">
        <li
          v-for="user in selectedUsers"
          :key="user.email"
          class="list-group-item"
        >
          <div class="choose-user">
            <div>{{ user.firstName }} {{ user.lastName }}</div>
            <Button
              @click="removeUser(user)"
              prepend-icon-name="bi bi-trash-fill"
              class="w-25% p-1"
            >
            </Button>
          </div>
        </li>
      </ul> -->

      <div class="d-flex justify-content-between">
        <div class="selectors">
          <Typography class-name="fs-6 text-primary"
            >Пользователи не в группе</Typography
          >
          <div class="select-block border">1</div>
        </div>
        <div class="selectors">
          <Typography class-name="fs-6 text-primary"
            >Пользователи в группе</Typography
          >
          <div class="select-block border">1</div>
        </div>
      </div>

      <Button
        class-name="btn-primary w-100"
        @click="handleCreate()"
        >Добавить</Button
      >
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.add-expert-group-modal {
  width: 600px;

  @include flexible(
    stretch,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  &__header {
    @include flexible(center, space-between);
  }

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .filter-modal,
.modal-layout-leave-to .filter-modal {
  transform: scale(0.9);
}

.list-group {
  max-height: 400px;
  overflow-y: scroll;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(209, 209, 209);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb {
  background-color: #0d6efd;
  border-radius: 20px;
  border: 3px solid #0d6efd;
}

.list-group-item {
  display: flex;
  width: 100%;
}

.choose-user {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.selectors {
  width: 48%;
}

.select-block {
  border-radius: 12px;
  height: 250px;
  overflow-y: scroll;
}
</style>
