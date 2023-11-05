<script lang="ts" setup>
import NotificationsWrapper from '@Components/NotificationsWrapper/NotificationsWrapper.vue'
import UserRolesWrapper from '@Components/UserRolesWrapper/UserRolesWrapper.vue'
</script>

<template>
  <router-view />

  <NotificationsWrapper />
  <UserRolesWrapper />
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  border: 0;

  scrollbar-width: thin;
  scrollbar-color: #888 transparent;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #888;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  background: url('/src/assets/images/backgroundImage.webp') center $white-color;
  background-size: cover;

  &.overflow {
    overflow: hidden;
  }
}

:focus,
:active {
  outline: none;
}

a:focus,
a:active {
  outline: none;
}

input,
button,
textarea {
  border: 0;

  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
}

button {
  background-color: inherit;

  cursor: pointer;
}

a,
a:visited {
  text-decoration: none;
  font-family: inherit;
  font-size: inherit;
}

a:hover {
  text-decoration: none;
}

img {
  display: block;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: inherit;
}

p {
  padding: 0;
  margin: 0;
}

#notifications {
  @include position(fixed, $top: 8px, $right: 8px, $z-index: 10);

  overflow-y: scroll;

  @include flexible(flex-start, stretch, column, $gap: 8px);
}

.bi {
  @include flexible(center, center);
}

input[type='checkbox'] {
  cursor: pointer;

  -ms-transform: scale(1.2);
  -moz-transform: scale(1.2);
  -webkit-transform: scale(1.2);
  -o-transform: scale(1.2);
  transform: scale(1.2);
}
</style>
