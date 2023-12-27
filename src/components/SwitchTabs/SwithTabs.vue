<script lang="ts" setup>
import { SwitchTabsProps, SwitchTab } from '@Components/SwitchTabs/SwithTabs.types'
import { computed, ref } from 'vue'

const props = defineProps<SwitchTabsProps>()

const currentIdTab = ref(props.tabs[0].id)

function getNavTabClass(id: string) {
  const initialClass = [
    'nav-link',
    'cursor-pointer',
    'fw-normal',
    props.tabClassName ?? '',
  ]
  if (id === currentIdTab.value) {
    initialClass.push('active', 'text-primary')
    return initialClass
  }
  initialClass.push('text-dark')
  return initialClass
}

function clickTab(tab: SwitchTab) {
  const { id, click } = tab
  currentIdTab.value = id
  click()
}

const wrapperClassName = computed(() => {
  return [
    'nav nav-underline mb-3 w-100 d-flex justify-content-center',
    props.wrapperClassName ?? '',
  ]
})
</script>

<template>
  <div :class="wrapperClassName">
    <div
      v-for="(tab, index) in tabs"
      :key="index"
      :class="getNavTabClass(tab.id)"
      @click="clickTab(tab)"
    >
      {{ tab.label }}
    </div>
  </div>
</template>
