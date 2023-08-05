<template>
  <PageLayout content-class-name="pass-page__content">
    <template #content>
      <div class="center">
        <div class="pass-recovery__typography">
          <Typography class-name="fs-2 text-primary"
            >Востановление пароля</Typography
          >
        </div>
        <Input
          placeholder="Введите email"
          prepend="Email"
          class="email__input"
          v-model="forgotPassEmail"
        ></Input>
        <Button
          class-name="btn-primary"
          class="emile-send__button"
          @click="forgotPassEmailSend"
          >Отправить</Button
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

const forgotPassEmail = ref('')
const forgotPasswordEmail = ref('')

const forgotPassEmailSend = () => {
  forgotPasswordEmail.value = forgotPassEmail.value //forgotPasswordEmail конечное значение
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

.pass-recovery__typography {
  margin-bottom: 32px;
}

.email__input {
  margin-bottom: 16px;
  border-color: #2151ff;
}

.emile-send__button {
  margin-top: 16px;
  width: 100%;
}
</style>
