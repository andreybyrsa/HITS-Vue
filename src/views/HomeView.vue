<script lang="ts" setup>
import HelloWorld from '@Components/HelloWorld.vue'
import PageLayout from '../layouts/PageLayout/PageLayout.vue'
</script>

<template>
  <PageLayout leftSideBar>
    <template v-slot:leftSideBar>
      <h1>HITS Idea</h1>
      <button>кнопка</button>
      <button>кнопка</button>
      <button>кнопка</button>
    </template>

    <template v-slot:content>
      <img
        alt="Vue logo"
        src="../assets/images/logo.png"
      />
      <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    </template>
  </PageLayout>
</template>

<style scoped lang="scss"></style>
