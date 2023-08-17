<script lang="ts" setup>
import NewIdeaForm from '@Components/Forms/NewIdeaForm/NewIdeaForm.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
// import { Idea } from '@Domain/Idea'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
// import { useRouter } from 'vue-router'

import useIdeasStore from '@Store/ideas/ideasStore'
import { storeToRefs } from 'pinia'

const ideasStore = useIdeasStore()
const { initiatorIdeas } = storeToRefs(ideasStore)

const router = useRoute()

const currentIdea = ref()

onMounted(() => {
  currentIdea.value = initiatorIdeas.value.find(
    (idea) => idea.id == +router.params.id,
  )
})
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
