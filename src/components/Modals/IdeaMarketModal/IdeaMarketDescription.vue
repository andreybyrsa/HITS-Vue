<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@Store'
import {
  IdeaMarketDescriptionProps,
  IdeaMarketModalEmits,
} from '@Components/Modals/IdeaMarketModal/IdeaMarketModal.types'
import { ideaMarketCollapses } from '@Components/Modals/IdeaMarketModal/IdeaMarketModalCollapses'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Typography from '@Components/Typography/Typography.vue'

defineProps<IdeaMarketDescriptionProps>()
const emit = defineEmits<IdeaMarketModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function getAccessToViewDescription() {
  const currentUser = user.value

  if (currentUser) {
    const { role } = currentUser

    return role !== 'INITIATOR' && role !== 'ADMIN'
  }
}
</script>

<template>
  <div class="idea-description">
    <div class="idea-description__header">
      <Button
        variant="primary"
        prepend-icon-name="bi bi-backspace-fill"
        @click="emit('close-modal')"
      >
        Назад
      </Button>

      <div class="idea-description__header-text p-2 w-100 bg-white rounded">
        <Typography class-name="fs-4 text-primary">
          {{ ideaMarket.name }}
        </Typography>
      </div>
    </div>

    <ul
      v-if="getAccessToViewDescription()"
      class="list-group rounded-3"
    >
      <li
        v-for="collapse in ideaMarketCollapses"
        :key="collapse.key"
        class="list-group-item p-0 overflow-hidden"
      >
        <Button
          class-name="collapse-controller btn-light w-100"
          v-collapse:openOnMount="collapse.id"
        >
          {{ collapse.text }}
        </Button>
        <Collapse :id="collapse.id.toString()">
          <div class="p-2">
            {{ ideaMarket[collapse.ideaKey] }}
          </div>
        </Collapse>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.idea-description {
  @include flexible(stretch, flex-start, column, $gap: 16px);

  &__header {
    @include flexible(stretch, flex-start, $gap: 16px);

    &-text {
      @include textEllipsis(1);
    }
  }
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
</style>
