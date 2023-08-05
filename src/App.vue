<template>
  <router-view />
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  border: 0;

  font-family: Arial, Helvetica, sans-serif;
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

input[type='checkbox'] {
  accent-color: $primary-color;

  cursor: pointer;

  -ms-transform: scale(1.2);
  -moz-transform: scale(1.2);
  -webkit-transform: scale(1.2);
  -o-transform: scale(1.2);
  transform: scale(1.2);
}
</style>
