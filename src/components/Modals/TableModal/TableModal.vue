<script lang="ts" setup>
import { onMounted, ref, VueElement } from 'vue'
import { storeToRefs } from 'pinia'

import { IdeaModalEmits } from '@Components/Modals/IdeaModal/IdeaModal.types'
import {
  TableWindowProps,
  TableWindowEmits,
} from '@Components/Modals/TableModal/TableModal.types'

import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'

defineProps<TableWindowProps>()

const emit = defineEmits<TableWindowEmits>()

const tableModalRef = ref<VueElement | null>(null)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
  }
})
</script>

<template>
  <div
    class="table-modal p-3 rounded-3 bg-white shadow"
    ref="tableModalRef"
    v-if="isOpened"
  >
    <div
      v-if="data.length == 1"
      class="d-flex gap-3"
    >
      <Button
        class="btn-outline-primary"
        prepend-icon-name="bi bi-eye"
        >Просмотреть</Button
      >
      <Button
        class="btn-outline-primary"
        prepend-icon-name="bi bi-pen"
        >Редактировать</Button
      >
      <Button class="btn-danger">Удалить</Button>
    </div>
    <div
      v-else
      class="d-flex gap-3"
    >
      <Button class="btn-outline-primary">Отправить в биржу идей</Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-modal {
  position: absolute;
  top: 0;
  left: auto;

  width: 90%;

  @include flexible(row, $gap: 16px, $align-self: stretch, $justify-self: flex-end);

  animation: start 0.3s ease-out;
}

@keyframes start {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0%);
  }
}
</style>
