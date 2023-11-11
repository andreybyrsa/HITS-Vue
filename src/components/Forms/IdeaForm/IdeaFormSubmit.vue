<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import {
  IdeaFormSubmitProps,
  IdeaFormSubmitEmits,
} from '@Components/Forms/IdeaForm/IdeaFormSubmit.types'

defineProps<IdeaFormSubmitProps>()
const emit = defineEmits<IdeaFormSubmitEmits>()
</script>

<template>
  <div class="d-flex justify-content-center align-items-center gap-3">
    <Button
      v-if="idea.status !== 'ON_EDITING'"
      variant="primary"
      @click="emit('on-save-draft')"
    >
      Сохранить черновик
    </Button>

    <Button
      variant="success"
      @click="emit('on-send-on-approval')"
    >
      Отправить на согласование
    </Button>
  </div>
</template>
