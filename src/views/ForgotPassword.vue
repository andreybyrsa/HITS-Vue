<template>
  <PageLayout content-class-name="pass-page__content">
    <template #content>
      <div
        style="
          width: 40%;

          padding: 24px;
          border-radius: 22px;
          box-shadow: 2px 2px 40px 0px rgba(0, 0, 0, 0.25);
        "
        class="center"
      >
        <div style="margin-bottom: 32px">
          <Typography class-name="fs-1 text-primary"
            >Востановление пароля</Typography
          >
        </div>
        <Input
          placeholder="Введите emile"
          label="Emile"
          style="margin-bottom: 16px; border-color: #2151ff"
        ></Input>
        <Button
          class-name="btn-primary"
          style="margin-top: 24px"
          >Отправить</Button
        >
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
</script>

<style lang="scss">
.pass-page {
  &__content {
    @include flexible(center, center, column, $gap: 16px);
  }
}

.center {
  @include flexible(start, center, column);
}
</style>
