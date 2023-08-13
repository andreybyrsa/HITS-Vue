<script lang="ts" setup>
import NewIdeaForm from '@Components/Forms/NewIdeaForm/NewIdeaForm.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import { Idea } from '@Domain/Idea'
// import { useRouter } from 'vue-router'

// const route = useRouter()

// const id = route.params.id

const idea: Idea = {
  name: 'Пирожки',
  dateCreated: new Date(),
  dateModified: new Date(),
  projectType: 'INSIDE',
  problem: 'проблема',
  solution: 'еще что то ',
  result: 'результвт',
  customer: 'Газпром',
  description: 'описание вроде',
  risk: 0.5,
  rating: 1,
  status: 'ON_EDITING',
}
</script>

<template>
  <PageLayout content-class-name="login-page__content">
    <template #leftSideBar>
      <LeftSideBar />
    </template>
    <template #content>
      <NewIdeaForm :current-idea="idea" />
      <!-- {{ $route.params.id }} -->
    </template>
  </PageLayout>
</template>

<style lang="scss">
.login-page {
  &__content {
    @include flexible(center, center);
  }
}
</style>
