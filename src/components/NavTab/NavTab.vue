<script lang="ts" setup>
import { computed } from 'vue'

import DropDown from '@Components/DropDown/DropDown.vue'
import NavTabProps from '@Components/NavTab/NavTab.types'

const props = withDefaults(defineProps<NavTabProps>(), {
  to: '/ideas',
})

const dropDownProps = {
  role: 'button',
  'data-bs-toggle': 'collapse',
  'data-bs-target': `#${props.to}`,
  'aria-expanded': false,
}

const NavTabClassName = computed(() => [
  'nav-link d-flex fs-5',
  { active: props.isActive },
  props.className,
])
</script>

<template>
  <div class="nav-item w-100">
    <router-link
      :class="NavTabClassName"
      :to="to"
      active-class="active"
      v-bind="routes && dropDownProps"
    >
      <i
        v-if="iconName"
        :class="iconName"
      ></i>

      <slot></slot>
    </router-link>

    <DropDown
      v-if="routes"
      :id="to"
    >
      <router-link
        v-for="route in routes"
        :key="route.id"
        class="list-group-item list-group-item-light"
        active-class="active"
        :to="route.to"
      >
        {{ route.text }}
      </router-link>
    </DropDown>
  </div>
</template>

<style lang="scss" scoped>
.nav-link {
  color: $black-color;

  @include flexible(center, flex-start, $gap: 4px);
}
</style>
