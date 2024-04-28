<script lang="ts" setup>
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
</script>

<template>
  <div class="d-flex flex-column h-100">
    <div
      class="text-center p-2 bg-primary rounded-top text-white fs-4 border border-bottom-0"
    >
      Комментарии
    </div>

    <div class="task-comments bg-white rounded-bottom p-3 border border-top-0">
      <div class="h-100 w-100">
        <Textarea
          name="team-leader"
          class-name="task-comments__textarea rounded-end"
          label="Тим-лидер"
          placeholder="Комментарий тим-лидера"
        />
      </div>

      <div class="h-100 w-100">
        <Textarea
          name="initiator"
          class-name="task-comments__textarea rounded-end"
          label="Исполнитель"
          placeholder="Комментарий исполнителя"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.task-comments {
  @include flexible(flex-start, flex-start, column, $gap: 12px);
  flex-grow: 1;

  &__textarea {
    height: 100%;
    width: 100%;
    resize: none;
  }
}
</style>
