<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { watchImmediate } from '@vueuse/core'

import MarketModal from '@Components/Modals/MarketModal/MarketModal.vue'

const route = useRoute()

const openModal = ref(false)

watchImmediate(
  () => route.params.id,
  (id) => {
    if (id) {
      setTimeout(() => {
        openModal.value = true
      }, 10)
    }
  },
)

function handleCloseIdeaModal() {
  openModal.value = false
}
</script>

<template>
  <MarketModal
    :is-opened="openModal"
    @close-modal="handleCloseIdeaModal"
  />
</template>

<style lang="scss"></style>
