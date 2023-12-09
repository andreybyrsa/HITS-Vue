<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  TeamDescriptionProps,
  TeamDescriptionEmits,
} from '@Components/Modals/TeamModal/TeamModal.types'
import Collapse from '@Components/Collapse/Collapse.vue'

defineProps<TeamDescriptionProps>()
const emit = defineEmits<TeamDescriptionEmits>()
</script>

<template>
  <div class="team-description-header">
    <Button
      variant="primary"
      prepend-icon-name="bi bi-backspace-fill"
      @click="emit('close-modal')"
    >
      Назад
    </Button>

    <Typography
      class-name="p-2 w-100 bg-white rounded-3 fs-4 text-primary text-nowrap overflow-x-scroll"
    >
      {{ team.name }}
    </Typography>
  </div>

  <ul class="list-group rounded-3">
    <li class="list-group-item p-0 overflow-hidden">
      <Button
        variant="light"
        class-name="collapse-controller w-100"
        v-collapse:openOnMount="'description'"
      >
        Описание команды
      </Button>
      <Collapse id="description">
        <div class="p-2">{{ team.description }}</div>
      </Collapse>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.team-description-header {
  @include flexible(stretch, flex-start, $gap: 16px);
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
</style>
