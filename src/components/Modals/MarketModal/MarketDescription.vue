<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import marketModalCollapses from '@Components/Modals/MarketModal/MarketModalCollapses'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  MarketDescriptionProps,
  MarketModalEmits,
} from '@Components/Modals/MarketModal/MarketModal.types'

import useUserStore from '@Store/user/userStore'

defineProps<MarketDescriptionProps>()
const emit = defineEmits<MarketModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function getAccessToViewDescription() {
  const currentUser = user.value

  if (currentUser) {
    const { role } = currentUser

    return role !== 'INITIATOR'
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

      <Typography
        class-name="p-2 w-100 bg-white rounded-3 fs-4 text-primary text-nowrap"
      >
        {{ ideaMarket.name }}
      </Typography>
    </div>

    <ul
      v-if="getAccessToViewDescription()"
      class="list-group rounded-3"
    >
      <li
        v-for="collapse in marketModalCollapses"
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
  }
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
</style>
