<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import {
  FormControllersProps,
  FormControllersEmits,
} from '@Components/Forms/AddUsersForm/AddUsersForm.types'

defineProps<FormControllersProps>()
const emit = defineEmits<FormControllersEmits>()
</script>

<template>
  <div class="form-controllers">
    <Button
      type="button"
      variant="primary"
      prepend-icon-name="bi bi-plus-lg"
      @click="emit('push-email', '')"
    >
      Добавить почту
    </Button>

    <Button
      type="button"
      variant="primary"
      prepend-icon-name="bi bi-file-earmark"
      @click="fileInputRef?.click()"
    >
      Загрузить файл
    </Button>

    <Button
      type="button"
      :variant="rolesError ? 'danger' : 'primary'"
      prepend-icon-name="bi bi-plus-lg"
      v-collapse="'addUsersFromCollapse'"
    >
      Выбрать роли
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.form-controllers {
  @include flexible(center, center, $gap: 12px);
}
</style>
