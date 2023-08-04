<template>
  <div class="page">
    <button
      class="show-modal-button"
      @click="showModal"
    >
      Показать модальное окно
    </button>
    <ModalWindow ref="modal"></ModalWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ModalWindow from '@Components/ModalWindow/ModalWindow.vue'
import getRoles from '@Utils/getRoles'

export default defineComponent({
  name: 'Window',
  components: {
    ModalWindow,
  },
  setup() {
    const showModal = () => {
      const modal = ref()
      modal.value = true
    }

    return {
      showModal,
    }
  },
})
</script>

<style scoped lang="scss">
body {
  font-family: 'Source Sans Pro', sans-serif;
  margin: 0;
  padding: 0;
  height: 100vh;
}

.page {
  position: relative;
  width: 100%;
  min-height: 100%;
}
</style>
