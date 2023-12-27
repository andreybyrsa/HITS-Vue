<script lang="ts" setup>
import {
  IdeaDescriptionProps,
  IdeaDescriptionEmits,
} from '@Components/Modals/IdeaModal/IdeaModal.types'
import ideaModalCollapses from '@Components/Modals/IdeaModal/IdeaModalCollapses'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Typography from '@Components/Typography/Typography.vue'
import Skills from '@Components/Skills/Skills.vue'

import { Idea } from '@Domain/Idea'

defineProps<IdeaDescriptionProps>()
const emit = defineEmits<IdeaDescriptionEmits>()
</script>

<template>
  <div class="idea-description-header">
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
      {{ idea.name }}
    </Typography>
  </div>

  <ul class="list-group rounded-3">
    <li
      v-for="collapse in ideaModalCollapses"
      :key="collapse.key"
      class="list-group-item p-0 overflow-hidden"
    >
      <Button
        variant="light"
        class-name="collapse-controller w-100"
        v-collapse:openOnMount="collapse.id"
      >
        {{ collapse.text }}
      </Button>
      <Collapse :id="collapse.id">
        <div class="p-2">
          {{ idea[collapse.ideaKey as keyof Idea] }}
        </div>
      </Collapse>
    </li>

    <li class="list-group-item p-0 overflow-hidden">
      <Button
        variant="light"
        class-name="collapse-controller w-100"
        v-collapse:openOnMount="'idea-skills'"
      >
        Стек технологий
      </Button>
      <Collapse id="idea-skills">
        <div class="p-2">
          <Skills :skills="ideaSkills?.skills" />
        </div>
      </Collapse>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.idea-description-header {
  @include flexible(stretch, flex-start, $gap: 16px);
}
.idea-skill-placeholder {
  width: 100px;
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
</style>
