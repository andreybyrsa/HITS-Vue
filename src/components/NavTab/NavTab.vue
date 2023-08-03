<script lang="ts" setup>
import { computed } from 'vue'

import NavTabProps from './NavTab.types'

const props = withDefaults(defineProps<NavTabProps>(), {
  to: '/ideas',
})

const NavTabClassName = computed(() => [
  'nav-link d-flex fs-5',
  { active: props.isActive },
  { 'dropdown-toggle': props.routes },
  props.className,
])

const dropDownProps = {
  role: 'button',
  'data-bs-toggle': 'dropdown',
  'aria-expanded': false,
}
</script>

<template>
  <div class="nav-item w-100">
    <router-link
      :class="NavTabClassName"
      :to="props.to"
      active-class="active"
      v-bind="props.routes && dropDownProps"
    >
      <div class="nav-link__content">
        <i
          v-if="props.iconName"
          :class="props.iconName"
        ></i>

        <slot></slot>
      </div>
    </router-link>

    <ul
      v-if="routes"
      class="dropdown-menu"
    >
      <li
        v-for="route in props.routes"
        :key="route.id"
      >
        <router-link
          class="dropdown-item"
          :to="route.to"
        >
          {{ route.text }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.nav-link {
  color: $black-color;

  @include flexible(center, space-between);

  &__content {
    @include flexible(center, flex-start, $gap: 4px);
  }
}
</style>
