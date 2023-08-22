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
  <div
    v-if="isEditing"
    class="d-flex gap-3 mx-auto"
  >
    <Button
      class-name="btn-primary px-4"
      @click="emit('on-update')"
    >
      Сохранить изменения
    </Button>
    <Button
      class-name="btn-danger px-4"
      @click="emit('on-delete')"
    >
      Удалить идею
    </Button>
  </div>

  <Button
    v-else
    class-name="btn-primary px-5 d-block mx-auto"
    @click="emit('on-submit')"
  >
    Создать идею
  </Button>
</template>
