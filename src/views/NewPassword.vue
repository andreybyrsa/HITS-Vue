<template>
  <PageLayout content-class-name="pass-page__content">
    <template #content>
      <div class="center">
        <div class="new-pass__typography">
          <Typography class-name="fs-1 text-primary">Новый пароль</Typography>
        </div>
        <Input
          placeholder="Введите пароль"
          prepend="Пароль"
          class="new-pass__input"
          v-model="newPass"
        ></Input>

        <Button
          class-name="btn btn-primary"
          class="pass-send__button"
          @click="newPassSend"
          >Изменить</Button
        >
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'

const newPass = ref('')
const newPassword = ref('')

const newPassSend = () => {
  newPassword.value = newPass.value //newPassword конечное значение
}
</script>

<style lang="scss">
.pass-page {
  &__content {
    @include flexible(center, center, column, $gap: 16px);
  }
}

.center {
  @include flexible(start, center, column);
  width: 400px;
  padding: 24px;
  border-radius: 22px;
  box-shadow: 2px 2px 40px 0px rgba(0, 0, 0, 0.25);
}

.pass-send__button {
  width: 100%;
  margin-top: 16px;
}

.new-pass__input {
  margin-bottom: 16px;
  border-color: #2151ff;
}

.new-pass__typography {
  margin-bottom: 32px;
}
</style>
