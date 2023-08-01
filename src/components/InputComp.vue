<script lang="ts" setup>
import { ref } from 'vue'
defineProps({
  inputType: String,
  inputPlaceholder: String,
  inputStyle: String,
  getModel: Function,
})
let inputModel = ref('')
</script>

<template>
  <input
    :type="inputType"
    :placeholder="inputPlaceholder"
    v-model="inputModel"
    @input="$emit('getModel', inputModel)"
    :class="inputStyle"
  />
</template>

<style></style>
