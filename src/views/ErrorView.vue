<script lang="ts" setup>
import { useRouter } from 'vue-router'

import { develop } from '@Assets/images'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

const router = useRouter()

function navigateToHomePage() {
  router.push({ name: 'home' })
}
</script>

<template>
  <PageLayout>
    <template #content>
      <div class="error-page">
        <img
          :src="develop"
          alt="Ошибка"
          class="error-page__img"
        />
        <Typography class-name="fs-2">Ошибка 404</Typography>
        <Typography class-name="error-page__text fs-5 w-100 text-center">
          Кажется что-то пошло не так! Страница, которую вы запрашиваете, не
          существует. Возможна она устарела, была удалена, или был введен неверный
          адрес в поисковой строке
        </Typography>
        <Button
          variant="primary"
          @click="navigateToHomePage"
        >
          Вернуться на главную страницу
        </Button>
      </div>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.error-page {
  @include flexible(center, center, column, $gap: 8px);

  &__img {
    width: 200px;

    animation: img 5s ease-out infinite;
  }

  &__text {
    max-width: 800px;
  }
}

@keyframes img {
  0% {
    transform: translate(0px, 0px);
  }
  50% {
    transform: translate(0px, 10px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}
</style>
