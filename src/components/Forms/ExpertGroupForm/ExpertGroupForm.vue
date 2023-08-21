<script lang="ts" setup>
import { ref } from 'vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import AddExpertGroup from '@Components/Modals/AddExpertGroupModal/AddExpertGroupModal.vue'

const searchedValue = ref('')

const isOpenedAddGroup = ref(false)
const currentAddExpertGroup = ref([] as string[])

function openAddGroupModal() {
  isOpenedAddGroup.value = true
}

function closeAddGroupModal(addExpertGroup?: string[]) {
  isOpenedAddGroup.value = false
  currentAddExpertGroup.value = addExpertGroup ?? []
}
</script>

<template>
  <FormLayout class-name="expert-group-form p-3">
    <Typography class-name="fs-2 text-primary text-center w-100"
      >Экспертные группы</Typography
    >
    <div class="w-50">
      <Input
        name="search"
        v-model="searchedValue"
        placeholder="Поиск группы или эксперта"
      >
        <template #append>
          <Button
            class-name="px-2 py-0"
            @click="openAddGroupModal"
          >
            <i class="bi bi-plus-lg"></i> Добавить группу
          </Button>
        </template>
      </Input>
      <div v-if="isOpenedAddGroup">
        <AddExpertGroup
          :isOpened="isOpenedAddGroup"
          :currentAddExpertGroup="currentAddExpertGroup"
          @close-modal="closeAddGroupModal"
        >
          <template #append>
            <Button
              class-name="btn-close"
              @click="closeAddGroupModal"
            >
              <i class="bi bi-x-lg"></i>
            </Button>
          </template>
        </AddExpertGroup>
      </div>
    </div>
  </FormLayout>
</template>

<style lang="scss" scoped>
.expert-group-form {
  width: 100%;
  height: 100%;
  background-color: $white-color;

  @include flexible(center, flex-start, column, $gap: 16px);

  &__content {
    max-height: 100%;

    overflow-y: scroll;

    @include flexible(stretch, flex-start, column, $gap: 8px);
  }
}
</style>
