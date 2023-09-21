<script lang="ts" setup>
import { useRouter } from 'vue-router'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'

import { develop } from '@Assets/images'

const router = useRouter()
</script>

<template>
  <PageLayout>
    <template #content>
      <div class="error-page w-100">
        <img
          :src="develop"
          alt="Ошибка"
          class="error-page__img"
        />
        <Typography class-name="fs-2">Ошибка 404</Typography>
        <Typography class-name="error-page__text fs-5 w-100 text-center"
          >Кажется что-то пошло не так! Страница, которую вы запрашиваете, не
          существует. Возможна она устарела, была удалена, или был введен не верный
          адрес в адресной строке
        </Typography>
        <Button
          type="submit"
          class-name="btn-primary"
          @click="router.go(-1)"
        >
          Вернуться назад
        </Button>
      </div>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.error-page {
  height: 80%;
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
