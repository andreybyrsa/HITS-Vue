<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import ComboBox from '@Components/Inputs/Combobox/Combobox.vue'

import { Tag } from '@Domain/Tag'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { tagsMocks } from '@Utils/getMocks'
import { Project } from '@Domain/Project'

const tagsAxios = defineAxios(tagsMocks)

// const getAllTags = async (token: string): Promise<Tag[] | Error> => {
//   return tagsAxios
//     .get('/tags/all', {
//       headers: { Authorization: `Bearer ${token}` },
//       signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
//     })
//     .then((response) => response.data)
//     .catch((error) => handleAxiosError(error, 'Ошибка получения тегов'))
// }

// const tags = async
</script>

<template>
  <div class="content__main border rounded-3 bg-white">
    <div class="ps-4 pt-2">
      <Header class="fs-4 text-primary">Создание задачи</Header>
    </div>
    <div class="ps-4 pt-2">
      <Typography class-name="text-primary">Название задачи*</Typography>
    </div>
    <div class="ps-4 pt-1 pe-4">
      <Input
        class="form-control rounded"
        type="text"
        placeholder="Название"
      />
    </div>
    <div class="ps-4 pt-2">
      <Typography class-name="text-primary">Описание задачи*</Typography>
    </div>
    <div class="ps-4 pt-1 pe-4">
      <textarea
        class="form-control rounded"
        placeholder="Описание"
      ></textarea>
    </div>
    <div class="ps-4 pt-1 pe-4">
      <!-- <ComboBox
        :name="`tag-${category.key}`"
        :options="skills[category.key]"
        :display-by="['name']"
        v-model="choosenSkills[category.key]"
        :placeholder="category.placeholder"
      ></ComboBox> -->
    </div>
    <div class="ps-4 pt-2 pe-4 d-flex gap-2">
      <Typography class-name="text-primary pt-1">Трудоёмкость*</Typography>
      <Input
        class="form-control rounded"
        type="text"
        placeholder="Часы"
      />
    </div>
    <div class="p-3">
      <Button
        variant="primary"
        class-name="w-100"
        >Создать задачу</Button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  &__main {
    width: 400px;
  }
}
.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
</style>
