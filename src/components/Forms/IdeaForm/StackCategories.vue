<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue'

import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import comboboxStackCategories from '@Components/Forms/IdeaForm/StackCategories'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'

import { Skill, SkillType } from '@Domain/Skill'

const stackValue = defineModel<Skill[]>({
  required: true,
})

const skills = ref<Record<SkillType, Skill[]>>()

const choosenSkills = reactive<Record<SkillType, Skill[]>>({
  LANGUAGE: stackValue.value.filter(
    (selectedValue) => selectedValue.role === 'LANGUAGE',
  ),
  FRAMEWORK: stackValue.value.filter(
    (selectedValue) => selectedValue.role === 'FRAMEWORK',
  ),
  DATABASE: stackValue.value.filter(
    (selectedValue) => selectedValue.role === 'DATABASE',
  ),
  DEVOPS: stackValue.value.filter(
    (selectedValue) => selectedValue.role === 'DEVOPS',
  ),
})

onMounted(async () => {
  const response = await new Promise<Record<SkillType, Skill[]>>((reslove) => {
    setTimeout(
      () =>
        reslove({
          LANGUAGE: [
            { id: '0', name: 'JavaScript', role: 'LANGUAGE' },
            { id: '1', name: 'TypeScript', role: 'LANGUAGE' },
          ],
          FRAMEWORK: [
            { id: '2', name: 'React', role: 'FRAMEWORK' },
            { id: '3', name: 'Vue', role: 'FRAMEWORK' },
          ],
          DATABASE: [
            { id: '4', name: 'Mongo DB', role: 'DATABASE' },
            { id: '5', name: 'SQLite', role: 'DATABASE' },
          ],
          DEVOPS: [
            { id: '6', name: 'Docker', role: 'DEVOPS' },
            { id: '7', name: 'Maven', role: 'DEVOPS' },
          ],
        }),
      1000,
    )
  }).then((response) => response)

  skills.value = response
})

watch(choosenSkills, (currentSills) => {
  let currentStack: Skill[] = []
  Object.values(currentSills).forEach((skills) => currentStack.push(...skills))

  stackValue.value = currentStack
})

function unselectTechnology(key: SkillType, index: number) {
  choosenSkills[key].splice(index, 1)
}

function getTechnologyClassName(key: SkillType) {
  const clasName = 'px-2 py-1 d-flex gap-1 bg-opacity-75 rounded text-white'

  switch (key) {
    case 'LANGUAGE':
      return clasName + ' bg-success'
    case 'FRAMEWORK':
      return clasName + ' bg-info'
    case 'DATABASE':
      return clasName + ' bg-warning'
    default:
      return clasName + ' bg-danger'
  }
}
</script>

<template>
  <div>
    <Typography class-name="text-primary">Стек технологий*</Typography>

    <div
      v-if="skills"
      class="stack-categories mt-2 w-100"
    >
      <div
        v-for="category in comboboxStackCategories"
        :key="category.id"
        class="w-25"
      >
        <Combobox
          name="stack"
          :options="skills[category.key]"
          :display-by="['name']"
          v-model="choosenSkills[category.key]"
          no-form-controlled
          :placeholder="category.placeholder"
          :multiselect-placeholder="category.multiselectPlaceholder"
        />
        <div
          v-if="stackValue.length"
          class="stack-categories__technologies mt-2"
        >
          <div
            v-for="(technology, index) in choosenSkills[category.key]"
            :key="index"
            :class="getTechnologyClassName(category.key)"
          >
            <Typography>{{ technology.name }}</Typography>
            <Icon
              class-name="stack-categories__delete-technology bi bi-x-lg"
              @click="unselectTechnology(category.key, index)"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="mt-2 w-100 d-flex gap-3"
    >
      <LoadingPlaceholder
        v-for="index in 3"
        :key="index"
        height="small"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stack-categories {
  @include flexible(flex-start, stretch, $gap: 16px);

  &__technologies {
    @include flexible(center, flex-start, $flex-wrap: wrap, $gap: 4px);
  }

  &__delete-technology {
    cursor: pointer;
  }
}
</style>
