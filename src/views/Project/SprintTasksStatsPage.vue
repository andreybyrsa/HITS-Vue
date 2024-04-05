<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  SprintInfoModalProps,
  SprintInfoModalEmits,
} from '@Components/Modals/SprintInfoModal/SprintInfoModal.types'

const props = defineProps<SprintInfoModalProps>()
const emit = defineEmits<SprintInfoModalEmits>()
</script>

<template>
  <div
    class="d-flex mt-2 w-100 h-100 flex-column gap-3 overflow-scroll sprint-list-page"
  >
    <ul class="list-group rounded-3 w-100">
      <li class="list-group-item p-0 overflow-hidden w-100">
        <Button
          variant="light"
          class-name="collapse-controller w-100"
          v-collapse:openOnMount="321"
        >
          Описание
        </Button>
        <Collapse id="321">
          <div class="p-2">
            {{ props.task?.name }}
          </div>
        </Collapse>
      </li>
    </ul>

    <div>
      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Заказчик:' }} </Typography>
        <Typography> {{ 'Иван Иванов' }} </Typography>
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Исполнитель:' }} </Typography>
        <Typography> {{ 'Артем Козлов' }} </Typography>
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary">
          {{ 'Трудоемкость(Часы):' }}
        </Typography>
        <Typography> {{ '3' }} </Typography>
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Теги:' }} </Typography>
        <Typography> {{ 'Бэкенд' }} </Typography>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}

.sprint-list-page {
  @include flexible(flex-start);
  height: 85%;
  max-height: 85%;
}
</style>
