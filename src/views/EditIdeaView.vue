<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import IdeaForm from '@Components/Forms/IdeaForm/IdeaForm.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import { Idea } from '@Domain/Idea'

import useIdeasStore from '@Store/ideas/ideasStore'

const ideasStore = useIdeasStore()
const { ideas } = storeToRefs(ideasStore)

const router = useRoute()

const currentIdea = ref<Idea>()

onMounted(() => {
  currentIdea.value = ideas.value.find((idea) => idea.id == +router.params.id)
})
</script>

<template>
  <PageLayout content-class-name="login-page__content">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <IdeaForm
        v-if="currentIdea"
        :idea="currentIdea"
      />
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
