<script lang="ts" setup>
import { SkillsProps, SkillsEmits } from '@Components/Skills/Skills.types'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'

import { SkillType } from '@Domain/Skill'

defineProps<SkillsProps>()
const emit = defineEmits<SkillsEmits>()

function getSkillClassName(key: SkillType) {
  const initialClasName = ['px-2', 'py-1', 'rounded', 'd-flex', 'gap-1']

  if (key === 'LANGUAGE') {
    initialClasName.push('bg-success-subtle', 'text-success')
    return initialClasName
  }

  if (key === 'FRAMEWORK') {
    initialClasName.push('bg-info-subtle', 'text-info')
    return initialClasName
  }

  if (key === 'DATABASE') {
    initialClasName.push('bg-warning-subtle', 'text-warning')
    return initialClasName
  }

  if (key === 'DEVOPS') {
    initialClasName.push('bg-danger-subtle', 'text-danger')
    return initialClasName
  }
}
</script>

<template>
  <div class="skills d-flex flex-wrap gap-1">
    <template v-if="skills">
      <div
        v-for="(skill, index) in skills"
        :key="index"
        :class="getSkillClassName(skill.type)"
      >
        <Typography>{{ skill.name }}</Typography>
        <Icon
          v-if="skillActionIcon"
          :class-name="`${skillActionIcon} skills__icon`"
          @click="emit('skill-action', skill, index)"
        />
      </div>
    </template>

    <template v-else>
      <div
        v-for="index in 4"
        :key="index"
        class="skills__placeholder"
      >
        <LoadingPlaceholder />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.skills {
  &__icon {
    cursor: pointer;
  }

  &__placeholder {
    width: 100px;
  }
}
</style>
