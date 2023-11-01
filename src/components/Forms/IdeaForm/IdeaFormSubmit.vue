<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import IdeaFormSubmitEmits from '@Components/Forms/IdeaForm/IdeaFormSubmit.types'

const emit = defineEmits<IdeaFormSubmitEmits>()
</script>

<template>
  <div class="d-flex justify-content-center align-items-center">
    <Button
      class-name="btn-primary px-5 d-block mx-2"
      @click="emit('on-update')"
    >
      Сохранить
    </Button>

    <Button
      class-name="btn-warning d-block mx-2"
      @click="emit('on-submit')"
    >
      Отправить на согласование
    </Button>
  </div>
</template>
