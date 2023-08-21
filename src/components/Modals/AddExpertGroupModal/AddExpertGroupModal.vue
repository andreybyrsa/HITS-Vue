<script lang="ts" setup>
import { ref } from 'vue'
import {
  AddExpertGroupModalProps,
  AddExpertGroupModalEmits,
  User,
} from '@Components/Modals/AddExpertGroupModal/AddExpertGroupModal.types'
import VueMultiselect from 'vue-multiselect'

const props = defineProps<AddExpertGroupModalProps>()
const emit = defineEmits<AddExpertGroupModalEmits>()

const users = ref<User[]>([
  { id: 1, name: 'Эксперт 1' },
  { id: 2, name: 'Эксперт 2' },
  { id: 3, name: 'Эксперт 3' },
  { id: 4, name: 'Эксперт 4' },
])

const selectedUsers = ref<User[]>([])

const removeUser = (user: User) => {
  const index = selectedUsers.value.indexOf(user)
  if (index !== -1) {
    selectedUsers.value.splice(index, 1)
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="add-expert-group-modal p-3 bg-white rounded-3">
      <div class="add-expert-group-modal__header">
        <Typography class-name="fs-2 text-primary"
          >Добавить группу экспертов</Typography
        >
        <Button
          class-name="btn-close"
          @click="emit('close-modal')"
        ></Button>
      </div>
      <VueMultiselect
        v-model="selectedUsers"
        :options="users"
        label="name"
        multiple
      ></VueMultiselect>

      <ul class="list-group">
        <li
          v-for="user in selectedUsers"
          :key="user.id"
          class="list-group-item"
        >
          {{ user.name }}
          <button
            @click="removeUser(user)"
            class="btn btn-danger"
          >
            Удалить
          </button>
        </li>
      </ul>

      <Button
        class-name="btn-primary w-100"
        @click="emit('close-modal')"
        >Добавить</Button
      >
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.add-expert-group-modal {
  width: 400px;

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
</style>
