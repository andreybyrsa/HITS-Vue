<script lang="ts" setup>
import ProfileIdeasProps from '@Views/Profile/Ideas.types'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Collapse from '@Components/Collapse/Collapse.vue'

const props = defineProps<ProfileIdeasProps>()
</script>

<template>
  <div class="w-100 bg-white border p-3 rounded-4">
    <div class="header border-bottom pb-1">
      <Typography class-name="fs-4 text-primary">Идеи</Typography>
    </div>
    <div class="content p-2">
      <div
        class="content__projects border w-100 px-1 pb-1 fs-5 rounded bg-white"
        v-for="idea in props.ideas"
        :key="idea"
      >
        <div class="d-flex justify-content-between w-100">
          <Button class-name=" p-0"
            ><Typography class-name="fs-5 ">Идея: {{ idea.name }}</Typography>
          </Button>
          <Button
            prepend-icon-name="bi bi-caret-up text-primary text-opacity-75"
            class-name="text-primary text-opacity-75"
            v-collapse="idea.id"
            >описание</Button
          >
        </div>
        <Collapse :id="idea.id">
          <Typography class-name="text-muted ms-4">{{
            idea.description
          }}</Typography>
        </Collapse>
      </div>
    </div>

    <div
      v-if="ideas.length === 0"
      class="d-flex w-100 justify-content-center"
    >
      <Typography class-name="fs-5">Идей нет</Typography>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content {
  width: 100%;
  @include flexible(flex-start, flex-start, column, $gap: 16px);
}
</style>
