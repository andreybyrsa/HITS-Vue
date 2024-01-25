<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import draggable from 'vuedraggable'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const list1 = ref([
  {
    name: 'Сделать перевод идей с командами в список проектов ',
    tag: { name: 'Фронтенд', color: '#cd1d1d' },
    id: 1,
  },
  {
    name: 'Сделать перевод идей с командами в список проектов ',
    tag: { name: 'Бэкенд', color: '#279b74' },
    id: 2,
  },
  {
    name: 'Сделать перевод идей с командами в список проектов ',
    tag: { name: 'Фронтенд', color: '#cd1d1d' },
    id: 3,
  },
  {
    name: 'Сделать перевод идей с командами в список проектов ',
    tag: { name: 'Бэкенд', color: '#279b74' },
    id: 4,
  },
])

const list2 = ref([
  {
    name: 'Сделать перевод идей с командами в список проектов ',
    tag: { name: 'Рефактор', color: '#cc8c33' },
    id: 5,
  },
  {
    name: 'Сделать перевод идей с командами в список проектов ',
    tag: { name: 'Фронтенд', color: '#cd1d1d' },
    id: 6,
  },
  {
    name: 'Сделать перевод идей с командами в список проектов ',
    tag: { name: 'Проектировка', color: '#2222fb' },
    id: 7,
  },
])

function checkMove(evt: any) {
  if (user.value?.role === 'ADMIN') return false
}
</script>

<template>
  <div class="active-sprint w-100 mt-4">
    <div class="border rounded p-3 w-100">
      <Typography class-name="fs-5 text-primary">На доработке</Typography>
      <draggable
        class="h-100 list-group"
        :list="list1"
        group="people"
      >
        <template #item="{ element }">
          <div class="my-2 p-2 border rounded">
            <div class="active-sprint__task">
              <Typography>{{ element.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon
                :style="{ color: element.tag.color }"
                class-name="bi bi-circle-fill fs-6"
              />
              <Typography>{{ element.tag.name }}</Typography>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <div class="border rounded p-3 w-100">
      <div class="active-sprint__header w-100">
        <Typography class-name="fs-5 text-primary">Новые</Typography>
        <Button variant="outline-primary">
          <Icon class-name="bi bi-plus fs-6" />
        </Button>
      </div>
      <draggable
        class="h-100 list-group"
        :list="list2"
        group="people"
      >
        <template #item="{ element }">
          <div class="my-2 p-2 border rounded">
            <div class="active-sprint__task">
              <Typography>{{ element.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon
                :style="{ color: element.tag.color }"
                class-name="bi bi-circle-fill fs-6"
              />
              <Typography>{{ element.tag.name }}</Typography>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <div class="border rounded p-3 w-100">
      <Typography class-name="fs-5 text-primary">Выполняются</Typography>
      <draggable
        class="h-100 list-group"
        :list="list1"
        group="people"
      >
        <template #item="{ element }">
          <div class="my-2 p-2 border rounded">
            <div class="active-sprint__task">
              <Typography>{{ element.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon
                :style="{ color: element.tag.color }"
                class-name="bi bi-circle-fill fs-6"
              />
              <Typography>{{ element.tag.name }}</Typography>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <div class="border rounded p-3 w-100">
      <Typography class-name="fs-5 text-primary">На проверке</Typography>
      <draggable
        class="h-100 list-group"
        :list="list1"
        group="people"
      >
        <template #item="{ element }">
          <div class="my-2 p-2 border rounded">
            <div class="active-sprint__task">
              <Typography>{{ element.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon
                :style="{ color: element.tag.color }"
                class-name="bi bi-circle-fill fs-6"
              />
              <Typography>{{ element.tag.name }}</Typography>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <div class="border rounded p-3 w-100">
      <Typography class-name="fs-5 text-primary">Выполнены</Typography>
      <draggable
        class="h-100 list-group"
        :list="list1"
        group="people"
      >
        <template #item="{ element }">
          <div class="my-2 p-2 border rounded">
            <div class="active-sprint__task">
              <Typography>{{ element.name }}</Typography>
            </div>
            <div class="d-flex gap-2">
              <Icon
                :style="{ color: element.tag.color }"
                class-name="bi bi-circle-fill fs-6"
              />
              <Typography>{{ element.tag.name }}</Typography>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.active-sprint {
  @include flexible(flex-start, space-between, $gap: 16px);

  &__task {
    @include textEllipsis(2);
  }

  &__header {
    @include flexible(flex-start, space-between);
  }
}
.draggable {
  height: 100%;
}
</style>
