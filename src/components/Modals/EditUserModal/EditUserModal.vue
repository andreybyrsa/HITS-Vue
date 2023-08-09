<script lang="ts" setup>
import { ref } from 'vue'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Typography from '@Components/Typography/Typography.vue'
import ModalLayout from '@Components/Modals/ModalLayout/ModalLayout.vue'
import {
  EditUserModalProps,
  EditUserModalEmits,
} from '@Components/Modals/EditUserModal/EditUserModal.types'

import { User } from '@Domain/User'

import ManageUsersService from '@Services/ManageUsersService'
import DropDown from '@Components/DropDown/DropDown.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'

import getRoles from '@Utils/getRoles'

const props = defineProps<EditUserModalProps>()

const emit = defineEmits<EditUserModalEmits>()

const response = ref('')

const availableRoles = getRoles()

const handleSubmit = async (user: User) => {
  const { error, success } = await ManageUsersService.saveEditedUser(user)

  if (!success) {
    response.value = ''
    return emit('close-modal', props.user)
  }
  if (error) {
    response.value = error
  }
}
</script>

<template>
  <ModalLayout :is-opened="isOpened">
    <div
      v-if="isOpened"
      class="edit-user-modal p-3 rounded-3"
    >
      <div class="edit-user-modal__header w-100">
        <Typography class-name="fs-3 text-primary"> Редактировать </Typography>

        <Button
          class-name="btn-close"
          @click="emit('close-modal')"
        ></Button>
      </div>

      <template v-if="user">
        <div class="edit-user-modal__inputs w-100">
          <Input
            v-model="user.email"
            placeholder="Введите email"
            prepend="@"
          />

          <Input
            v-model="user.firstName"
            placeholder="Введите имя"
          >
            <template #prepend>
              <i class="bi bi-fonts"></i>
            </template>
          </Input>

          <Input
            v-model="user.lastName"
            placeholder="Введите фамилию"
          >
            <template #prepend>
              <i class="bi bi-fonts"></i>
            </template>
          </Input>

          <Button
            id="checkbox-roles"
            class-name="px-1 py-0"
            icon-name="bi bi-chevron-down"
            is-drop-down-controller
          >
            Роли
          </Button>
          <DropDown
            id="checkbox-roles"
            class-name="w-100"
          >
            <template
              v-for="role in availableRoles.roles"
              :key="role"
            >
              <Checkbox
                v-model="user.roles"
                :value="role"
                :label="availableRoles.translatedRoles[role]"
              />
            </template>
          </DropDown>
        </div>

        <Button
          class-name="btn-primary w-100"
          @click="handleSubmit(user)"
        >
          Сохранить изменения
        </Button>
      </template>

      <Typography
        v-if="response"
        class-name="text-danger w-100 text-center"
      >
        {{ response }}
      </Typography>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.edit-user-modal {
  width: 400px;
  background-color: $white-color;

  @include flexible(
    flex-end,
    flex-start,
    column,
    $gap: 16px,
    $align-self: center,
    $justify-self: center
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }

  &__inputs {
    @include flexible(center, flex-start, column, $gap: 8px);
  }
}

.modal-layout-enter-from .edit-user-modal,
.modal-layout-leave-to .edit-user-modal {
  transform: scale(0.9);
}
</style>
