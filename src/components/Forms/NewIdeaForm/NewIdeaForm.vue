<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Typography from '@Components/Typography/Typography.vue'
import NewIdeaProps from '@Components/Forms/NewIdeaForm/NewIdeaForm.types'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import RatingCalculator from '@Components/Forms/NewIdeaForm/ratingCalculator.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { Idea } from '@Domain/Idea'

import useIdeasStore from '@Store/ideas/ideasStore'

const props = defineProps<NewIdeaProps>()

const router = useRouter()
const route = useRoute()

const ideasStore = useIdeasStore()

const ideaData = reactive<Idea>({
  name: '',
  dateCreated: new Date(),
  dateModified: new Date(),
  projectType: 'INSIDE',
  problem: '',
  solution: '',
  result: '',
  customer: '',
  description: '',
  risk: 0.5,
  rating: 1,
  status: 'ON_EDITING',
  // status: 'NEW',
})

watch(
  () => props.currentIdea,
  () => {
    if (props.currentIdea) {
      const {
        name,
        projectType,
        problem,
        solution,
        result,
        customer,
        description,
      } = props.currentIdea
      ideaData.name = name
      ideaData.dateModified = new Date()
      ideaData.projectType = projectType
      ideaData.problem = problem
      ideaData.solution = solution
      ideaData.result = result
      ideaData.customer = customer
      ideaData.description = description
      ideaData.status = 'ON_EDITING'
    }
  },
)

function setRatingEmit(rating: number) {
  ideaData.rating = rating
}

function handlePostIdea(idea: Idea) {
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiQURNSU4iLCJJTklUSUFUT1IiLCJFWFBFUlQiLCJQUk9KRUNUX09GRklDRSJdLCJzdWIiOiJwb2NodGE1NUBtYWlsLmNvbSIsImlzcyI6ImxvY2FsaG9zdDozMDAwIiwiaWF0IjoxNjkyMjg1OTYxLCJleHAiOjE2OTIzNzIzNjF9.w-J2jtixlNESXy5uO-xvtc7EybuuJQbbvWJmjHBZ3C8'
  ideasStore.postInitiatorIdeas(idea, token)
  router.push('/ideas')
}
function handleEditIdea(idea: Idea, id: number) {
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiQURNSU4iLCJJTklUSUFUT1IiLCJFWFBFUlQiLCJQUk9KRUNUX09GRklDRSJdLCJzdWIiOiJwb2NodGE1NUBtYWlsLmNvbSIsImlzcyI6ImxvY2FsaG9zdDozMDAwIiwiaWF0IjoxNjkyMjg1OTYxLCJleHAiOjE2OTIzNzIzNjF9.w-J2jtixlNESXy5uO-xvtc7EybuuJQbbvWJmjHBZ3C8'
  ideasStore.putInitiatorIdeas(idea, id, token)
  router.push('/ideas')
}
function handleDelete(id: number) {
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiQURNSU4iLCJJTklUSUFUT1IiLCJFWFBFUlQiLCJQUk9KRUNUX09GRklDRSJdLCJzdWIiOiJwb2NodGE1NUBtYWlsLmNvbSIsImlzcyI6ImxvY2FsaG9zdDozMDAwIiwiaWF0IjoxNjkyMjg1OTYxLCJleHAiOjE2OTIzNzIzNjF9.w-J2jtixlNESXy5uO-xvtc7EybuuJQbbvWJmjHBZ3C8'
  ideasStore.deleteInitiatorIdeas(id, token)
  router.push('/ideas')
}
</script>

<template>
  <FormLayout class-name="align-items-start w-100 h-100 overflow-auto">
    <Typography
      v-if="!$props.currentIdea"
      class-name="fs-1 text-primary"
      >Создание идеи</Typography
    >
    <Typography
      v-if="$props.currentIdea"
      class-name="fs-1 text-primary"
      >Редактирование идеи</Typography
    >
    <div style="width: 50%">
      <Input
        v-model="ideaData.name"
        name="nameIdea"
        label="Название идеи*"
        placeholder="Введите название идеи"
        class-name="fs-6"
      ></Input>
    </div>

    <Typography class-name="fs-6 text-primary">Тип проекта*</Typography>
    <select
      v-model="ideaData.projectType"
      class="form-select w-50"
      aria-label="Floating label select example"
    >
      <option
        selected
        disabled
      >
        Выберите тип проекта
      </option>
      <option value="INSIDE">Внутренний</option>
      <option value="OUTSIDE">Внешний</option>
    </select>

    <div style="width: 50%">
      <Input
        v-model="ideaData.problem"
        name="problemIdea"
        label="Проблема*"
        placeholder="Опишите проблему, которую решает ваша идея"
        class-name="fs-6"
      ></Input>
    </div>

    <div style="width: 50%">
      <Input
        v-model="ideaData.solution"
        name="resolveIdea"
        label="Предлагаемое решение*"
        placeholder="Опишите, что вы предлагаете для решения проблемы"
        class-name="fs-6"
      ></Input>
    </div>

    <div style="width: 50%">
      <Input
        v-model="ideaData.result"
        name="resultIdea"
        label="Ожидаемый результат*"
        placeholder="Опишите ожидаемый результат"
        class-name="fs-6"
      ></Input>
    </div>

    <div style="width: 50%">
      <Typography class-name="fs-6 text-primary">Заказчик*</Typography>
      <select
        v-model="ideaData.customer"
        class="form-select w-50"
      >
        <option
          selected
          disabled
        >
          Выберите заказчика
        </option>
        <option>Газпром</option>
        <option>Роснефть</option>
      </select>
    </div>
    <div style="width: 50%">
      <Typography class-name="fs-6 text-primary">Контактное лицо*</Typography>
      <select
        class="form-select w-50"
        aria-label="Floating label select example"
      >
        <option
          selected
          disabled
        >
          Выберите контактное лицо
        </option>
        <option>1</option>
        <option>2</option>
      </select>
    </div>

    <div style="width: 50%">
      <Input
        v-model="ideaData.description"
        name="resourcesIdea"
        label="Описание необходимых ресурсов для реализации*"
        placeholder="Укажите список требуемых для выполнения проекта ресурсов"
        class-name="fs-6"
      ></Input>
    </div>
    <RatingCalculator @set-rating="setRatingEmit" />
    <Button
      v-if="!$props.currentIdea"
      class-name="btn-primary d-block mx-auto"
      @click="handlePostIdea(ideaData)"
      >Создать идею</Button
    >
    <div
      v-if="$props.currentIdea"
      class="button-props w-100"
    >
      <Button
        class-name="btn-primary"
        @click="handleEditIdea(ideaData, +route.params.id)"
        >Редактировать</Button
      >
      <Button
        class-name="btn-danger"
        @click="handleDelete(+route.params.id)"
        >Удалить</Button
      >
    </div>
  </FormLayout>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 10px;
  background-color: #d8d8d8;
  border-radius: 3rem;
}

::-webkit-scrollbar-thumb {
  border-radius: 3rem;
  background-color: #e7e7e7;
}

::-webkit-scrollbar-track {
  border-radius: 3rem;
}

.button-props {
  @include flexible(flex-start, center, $gap: 20px);
}
</style>
