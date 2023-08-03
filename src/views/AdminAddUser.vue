<script lang="ts" setup>
import Input from '@Components/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
</script>

<template>
  <PageLayout content-class-name="dev-page__content p-3">
    <template #leftSideBar> </template>

    <template #content>
      <Typography class-name="fs-2 text-primary"
        >Добавление пользователей</Typography
      >
      <div class="w-100 h-75 center">
        <div class="add-user-block">
          <div class="button-center">
            <Button
              type="button"
              :class-name="[
                'fs-6',
                $route.name == 'addUser' ? 'text-primary' : 'text-muted',
                'mbutton',
              ]"
              @click="$router.push('/admin/add/user')"
            >
              Добавить пользователя
            </Button>
            <Button
              type="button"
              :class-name="[
                'fs-6',
                $route.name == 'addUsers' ? 'text-primary' : 'text-muted',
                'mbutton',
              ]"
              @click="$router.push('/admin/add/users')"
            >
              Добавить пользователей
            </Button>
          </div>
          <div class="w-100 my-2">
            <Input
              v-if="$route.name == 'addUser'"
              type="email"
              placeholder="Введите email"
            />
            <Input
              v-if="$route.name == 'addUsers'"
              type="file"
              placeholder="Выберите файл"
            />
          </div>
          <select class="w-100 my-2 form-control form-control-lg">
            <option
              value="0"
              hidden
              disabled
              selected
            >
              Выберите роль
            </option>
            <option value="initiator">Инициатор</option>
            <option value="expert">Эксперт</option>
            <option value="projectoffice">Проектный офис</option>
            <option
              v-if="$route.path.includes('/admin', 0)"
              value="admin"
            >
              Админ
            </option>
          </select>
          <Button
            class-name="btn-primary"
            class="my-4 w-100"
          >
            Добавить
          </Button>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.dev-page {
  &__content {
    @include flexible(flex-start, flex-start, column, $gap: 16px);
  }
}
.add-user-block {
  width: 500px;
  height: 270px;
  border-radius: 20px;
  box-shadow: 2px 2px 40px 0px rgba(0, 0, 0, 0.25);
  padding: 16px;
}
.center {
  @include flexible(center, flex-start, column);
}
.button-center {
  @include flexible(center, center, row);
}
.active-text {
  color: $primary-color;
}
.unactive-text {
  color: grey;
}
</style>
