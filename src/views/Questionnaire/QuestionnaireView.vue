<script lang="ts" setup>
import QuestionnaireHeader from '@Views/Questionnaire/QuestionnaireHeader.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'
import QuestionnaireContent from '@Views/Questionnaire/QuestionnaireContent.vue'
</script>

<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="quest-page__content bg-white"
  >
    <QuestHeader />
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header />
    </template>

    <template #content>
      <div class="p-4 h-100">
        <QuestionnaireHeader />
        <QuestionnaireContent />
      </div>
      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss" scoped>
.quest-page {
  background-color: white !important;
  &__content {
    overflow-y: scroll;

    @include flexible(stretch, flex-start, column);
  }
}
</style>
