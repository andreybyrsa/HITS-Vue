<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import AddUser from '@Components/AddUser/AddUser.vue'
import AddUsers from '@Components/AddUsers/AddUsers.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
</script>

<template>
  <PageLayout content-class-name="dev-page__content p-3">
    <template #leftSideBar> </template>

    <template #content>
      <Typography class-name="fs-2 text-primary"
        >Добавление пользователей</Typography
      >
      <div class="center w-100 h-75">
        <div class="add-user-block p-3 rounded shadow">
          <AddUser v-if="$route.name == 'addUser'" />
          <AddUsers v-if="$route.name == 'addUsers'" />
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
}
.center {
  @include flexible(center, center, column);
}
</style>
