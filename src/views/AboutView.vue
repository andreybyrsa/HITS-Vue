<script lang="ts" setup>
import { ref } from 'vue'
import InputComp from '@Components/InputComp.vue'

let model = ref<string | number>('')

let InpStyle = ref('idea-input')

function getInputModel(data) {
  model.value = data
}
function changeInputStyle(style) {
  InpStyle.value = style
}
</script>

<template>
  <div style="@flex (center,center); height: 150px">
    <InputComp
      inputType="text"
      inputPlaceholder="пример placeholder'а"
      :inputStyle="InpStyle"
      @getModel="getInputModel"
    />
    <div style="width: 50%; word-break: break-all; text-align: left">
      {{ model }}
    </div>
  </div>
  <div>
    <button
      type="button"
      @click="changeInputStyle('idea-input')"
    >
      Стиль создания идеи
    </button>
    <button
      type="button"
      @click="changeInputStyle('login-input')"
    >
      Стиль логина
    </button>
  </div>
</template>

<style>
.idea-input {
  width: 50%;
  height: 50%;
  border: 1px solid #64b5f6;
  border-radius: 4px;
  font-size: 25px;
  box-sizing: border-box;
  padding-left: 16px;
  padding-right: 16px;
  box-shadow: 0px 0px 0px 4px #3184fd40;
}
.login-input {
  width: 50%;
  height: 50%;
  border: 1px solid #2151ff;
  border-radius: 12px;
  font-size: 25px;
  box-sizing: border-box;
  padding-left: 16px;
  padding-right: 16px;
}

.idea-input::placeholder,
.login-input::placeholder {
  color: #9a9a9a;
  user-select: none;
}
.idea-input:focus,
.login-input:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.idea-input:focus::placeholder,
.login-input:focus::placeholder {
  color: transparent;
}
</style>
