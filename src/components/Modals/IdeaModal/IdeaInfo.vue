<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import { IdeaInfoProps } from '@Components/Modals/IdeaModal/IdeaModal.types'

import getStatus from '@Utils/getStatus'

defineProps<IdeaInfoProps>()

const status = getStatus()
</script>

<template>
  <Typography
    v-if="idea"
    class-name="p-2 bg-primary rounded-top fs-4 text-center text-white"
  >
    {{ status.translatedStatus[idea.status] }}
  </Typography>

  <div class="idea-info w-100 pb-3 px-3">
    <div v-if="idea?.customer">
      <Typography class-name="border-bottom text-secondary d-block">
        Заказчик
      </Typography>

      <div class="idea-info__user pt-2">
        <Icon class-name="bi bi-person-circle text-secondary fs-1 opacity-25" />

        <Typography class-name="text-primary">
          {{ idea.customer }}
        </Typography>
      </div>
    </div>

    <div v-if="idea?.initiator">
      <Typography class-name="border-bottom text-secondary d-block">
        Инициатор
      </Typography>

      <div class="idea-info__user pt-2">
        <Icon class-name="bi bi-person-circle text-secondary fs-1 opacity-25" />

        <Typography class-name="text-primary">
          {{ idea.initiator }}
        </Typography>
      </div>
    </div>

    <div v-if="idea?.experts">
      <div
        class="idea-info__experts border-bottom pointers"
        data-bs-toggle="collapse"
        data-bs-target="#experts"
        aria-expanded="false"
      >
        <Typography class-name="text-secondary">Эксперты</Typography>

        <Icon class-name="bi bi-chevron-down me-2 fs-5 text-secondary" />
      </div>

      <Collapse id="experts">
        <div class="idea-modal__info-users py-2">
          <div
            v-for="(value, index) in idea.experts"
            :key="index"
            class="idea-info__user"
          >
            <Icon class-name="bi bi-chevron-down me-2 fs-5 text-secondary" />

            <Typography class-name="text-primary">
              {{ value }}
            </Typography>
          </div>
        </div>
      </Collapse>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.idea-info {
  @include flexible(stretch, flex-start, column, $gap: 16px);

  &__user {
    @include flexible(center, flex-start, $gap: 8px);
  }

  &__users {
    @include flexible(stretch, flex-start, column, $gap: 8px);
  }

  &__experts {
    cursor: pointer;

    @include flexible(center, space-between);
  }
}
</style>
