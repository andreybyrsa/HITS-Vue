<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { TestProps } from '@Components/Modals/TestModal/TestModal.type'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

import { Test } from '@Domain/Test'

import useTestStore from '@Store/tests/testsStore'
import useUserStore from '@Store/user/userStore'
import { useRouter } from 'vue-router'

const isAvailable = ref(true)
const router = useRouter()

const testsStore = useTestStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const props = defineProps<TestProps>()

const isLoading = ref(false)

function goTest(testName: string) {
  router.push(`/tests/start-test/${testName}`)
}

function accessEdit() {
  const currentUser = user.value

  if (currentUser) {
    const { id: userId } = currentUser

    return (
      (currentUser.role === 'PROJECT_OFFICE' || currentUser.role === 'ADMIN') &&
      isAvailable.value
    )
  }
}
</script>
<template>
  <div class="test-data p-3 w-100 bg-white rounded">
    <Typography class-name="w-100 bg-white rounded fs-5 text-primary">
      Название теста
    </Typography>
    <Typography> {{ test.name }} </Typography>
  </div>
  <div class="test-data p-3 w-100 bg-white rounded">
    <Typography class-name="w-100 bg-white rounded fs-5 text-primary">
      Инструкция к тесту
    </Typography>
    <Typography> {{ test.description }} </Typography>
  </div>
  <div class="test-data__buttons p-3 w-100 bg-white rounded">
    <Button
      variant="primary"
      @click="goTest(test.testName)"
    >
      Пройти тест
    </Button>
    <Button
      v-if="accessEdit()"
      variant="primary"
      @click="goTest"
    >
      Посмотреть результаты
    </Button>
  </div>
</template>
<style lang="scss" scoped>
.test-data {
  @include flexible(flex-start, flex-start, column, $gap: 16px);

  &__buttons {
    @include flexible(stretch, flex-start, row, $gap: 16px);
  }
}
</style>
