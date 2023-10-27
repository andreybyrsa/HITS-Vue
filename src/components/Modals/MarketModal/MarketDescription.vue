<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import marketModalCollapses from '@Components/Modals/MarketModal/MarketModalCollapses'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  MarketDescriptionProps,
  MarketModalEmits,
} from '@Components/Modals/MarketModal/MarketModal.types'

import useUserStore from '@Store/user/userStore'
import Market from '@Domain/Market'

defineProps<MarketDescriptionProps>()

const emit = defineEmits<MarketModalEmits>()

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function closeModal() {
  emit('close-modal')
  router.push('/market')
}
</script>

<template>
  <div class="idea-description">
    <div class="idea-description-header">
      <Button
        class-name="btn-primary"
        prepend-icon-name="bi bi-backspace-fill"
        @click="closeModal"
      >
        Назад
      </Button>

      <Typography
        class-name="p-2 w-100 bg-white rounded-3 fs-4 text-primary text-nowrap"
      >
        {{ idea?.name }}
      </Typography>
    </div>

    <ul
      v-if="user?.email != idea?.initiator"
      class="list-group rounded-3"
    >
      <li
        v-for="collapse in marketModalCollapses"
        :key="collapse.key"
        class="list-group-item p-0 overflow-hidden"
      >
        <Button
          class-name="collapse-controller btn-light w-100"
          v-collapse="collapse.id"
        >
          {{ collapse.text }}
        </Button>
        <Collapse :id="collapse.id">
          <div class="p-2">
            {{ idea?.[collapse.ideaKey as keyof Market] }}
          </div>
        </Collapse>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.idea-description {
  @include flexible(stretch, flex-start, column, $gap: 16px);

  &-header {
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
