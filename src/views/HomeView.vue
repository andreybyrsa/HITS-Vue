<script lang="ts" setup>
import HelloWorld from '@Components/HelloWorld.vue'
import ButtonVue from '@Components/Button/Button.vue'
</script>

<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../assets/images/logo.png"
    />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
  <ButtonVue
    :class-name="'btn btn-primary'"
    :icon-name="'bi bi-arrow-counterclockwise'"
    >Initiator</ButtonVue
  >
</template>
