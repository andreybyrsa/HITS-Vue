<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'

const letter = defineModel<string>()
</script>

<template>
  <Typography class-name="border-bottom fs-6 text-secondary w-100"
    >Мотивационное письмо
  </Typography>

  <Textarea
    class-name="letter w-100 rounded-end"
    name="letter"
    validate-on-update
    v-model="letter"
  />
</template>

<style lang="scss" scoped></style>
