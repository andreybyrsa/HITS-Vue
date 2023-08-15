<script lang="ts" setup>
import NewIdeaForm from '@Components/Forms/NewIdeaForm/NewIdeaForm.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import { Idea } from '@Domain/Idea'
import { useRoute } from 'vue-router'
import useIdeasStore from '@Store/ideas/ideasStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const router = useRoute()

const ideasStore = useIdeasStore()
const { initiatorIdeas } = storeToRefs(ideasStore)

onMounted(async () => {
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpb3VAbWFpbC5jb20iLCJpYXQiOjE2OTIxMDYxNTksImV4cCI6MTY5MjEwOTc1OX0.-rsfH6NeQFKvMg34jNjVqTMiMabMfp0Fonp2OC8fjYM'
  await ideasStore.fetchIdeas(token)
})

const ideaId = +router.params.id
const currentIdea = initiatorIdeas.value.find((item: Idea) => item.id == ideaId)

console.log(ideaId)
console.log(currentIdea)
</script>

<template>
  <PageLayout content-class-name="login-page__content">
    <template #leftSideBar>
      <LeftSideBar />
    </template>
    <template #content>
      <NewIdeaForm :current-idea="currentIdea" />
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
