<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  TeamAccessionsHeaderEmits,
  TeamAccessionsHeaderProps,
} from '@Components/Modals/TeamAccessionsModal/TeamAccessionsModal.types'

defineProps<TeamAccessionsHeaderProps>()

const emit = defineEmits<TeamAccessionsHeaderEmits>()

const closeTeamModal = () => {
  emit('closeTeamModal')
}
</script>

<template>
  <div class="header">
    <Button
      class-name="btn-primary"
      prepend-icon-name="bi bi-backspace-fill"
      @click="closeTeamModal"
    >
      Назад
    </Button>

    <Typography
      class-name="p-3 w-100 bg-white rounded-3 fs-5 text-primary text-nowrap overflow-x-scroll"
    >
      Завления и приглашения в команду {{ team.name }}
    </Typography>
  </div>
</template>

<style lang="scss" scoped>
.header {
  @include flexible(stretch, flex-start, $gap: 16px);
}
</style>
