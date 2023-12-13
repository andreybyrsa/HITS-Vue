<script lang="ts" setup>
import { SkillsProps, SkillsEmits } from '@Components/Skills/Skills.types'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'

import { SkillType } from '@Domain/Skill'

import { getSkillInfoStyle } from '@Utils/skillsInfo'

defineProps<SkillsProps>()
const emit = defineEmits<SkillsEmits>()

function getSkillClassName(key: SkillType) {
  const skillTypeClass = getSkillInfoStyle(key)

  return ['px-2', 'py-1', 'rounded', 'd-flex', 'gap-1', ...skillTypeClass]
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
