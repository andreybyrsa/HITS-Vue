<script lang="ts" setup>
import { computed } from 'vue'

import { NavTabProps } from '@Components/NavTab/NavTab.types'
import Collapse from '@Components/Collapse/Collapse.vue'

const props = defineProps<NavTabProps>()

const collapseProps = {
  role: 'button',
  'data-bs-toggle': 'collapse',
  'data-bs-target': `#${props.to}`,
  'aria-expanded': false,
}

const WrapperClassName = computed(() => ['nav-item', props.wrapperClassName])

const NavTabClassName = computed(() => [
  'nav-link d-flex',
  { active: props.isActive },
  props.className,
])
</script>

<template>
  <div :class="WrapperClassName">
    <router-link
      :class="NavTabClassName"
      :to="to"
      active-class="active"
      v-bind="routes && collapseProps"
    >
      <i
        v-if="iconName"
        :class="iconName"
      ></i>
      {{ label }}
    </router-link>

    <Collapse
      v-if="routes"
      :id="to"
    >
      <div class="pt-2 rounded">
        <router-link
          v-for="route in routes"
          :key="route.id"
          class="nav-route list-group-item list-group-item-light"
          active-class="active"
          :to="route.to"
        >
          <i
            v-if="route.iconName"
            :class="route.iconName"
          ></i>

          <span v-if="label">{{ route.text }}</span>
        </router-link>
      </div>
    </Collapse>
  </div>
</template>

<style lang="scss" scoped>
.nav-link {
  @include fixedHeight(40px);

  color: $black-color;

  @include flexible(center, flex-start, $gap: 4px);
}

.nav-route {
  @include fixedHeight(40px);

  @include flexible(center, flex-start, $gap: 4px);
}
</style>
