<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import RatingCalculator from '@Components/Forms/NewIdeaForm/ratingCalculator.vue'
import CustomerAndContact from '@Components/Forms/NewIdeaForm/CustomerAndContact.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { Idea } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'

const router = useRouter()

const ideasStore = useIdeasStore()
const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const ideaData = reactive<Idea>({
  id: 0,
  name: '',
  dateCreated: new Date(),
  dateModified: new Date(),
  projectType: 'INSIDE',
  problem: '',
  solution: '',
  result: '',
  customer: '',
  contactPerson: '',
  description: '',
  risk: 0.5,
  rating: 1,
  status: 'ON_EDITING',
  comments: [],
})

// if (props.currentIdea) {
//   ideaData.name = props.currentIdea.name
//   ideaData.projectType = props.currentIdea.projectType
//   ideaData.problem = props.currentIdea.problem
//   ideaData.solution = props.currentIdea.solution
//   ideaData.result = props.currentIdea.result
//   ideaData.customer = props.currentIdea.customer
//   ideaData.description = props.currentIdea.description
// }

function setRatingEmit(rating: number) {
  ideaData.rating = rating
}

import Validation from '@Utils/Validation'
import { useForm } from 'vee-validate'

const { handleSubmit } = useForm<Idea>({
  validationSchema: {
    nameIdea: (value: string) =>
      Validation.checkName(value) || 'Поле не заполнено',
    problemIdea: (value: string) =>
      Validation.checkName(value) || 'Поле не заполнено',
    resolveIdea: (value: string) =>
      Validation.checkName(value) || 'Поле не заполнено',
    resultIdea: (value: string) =>
      Validation.checkName(value) || 'Поле не заполнено',
    resourcesIdea: (value: string) =>
      Validation.checkName(value) || 'Поле не заполнено',
  },
})

const handleIdea = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    ideasStore.postInitiatorIdeas(values, token)
    router.push('/ideas')
  }
})
</script>

<template>
  <FormLayout class-name="align-items-start w-100 h-100 overflow-auto">
    <Typography class-name="fs-1 text-primary">Создание идеи</Typography>
    <div style="width: 50%">
      <Textarea
        v-model="ideaData.name"
        name="nameIdea"
        label="Название идеи*"
        placeholder="Введите название идеи"
        class-name="fs-6"
      ></Textarea>
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
      <Textarea
        v-model="ideaData.problem"
        name="problemIdea"
        label="Проблема*"
        placeholder="Опишите проблему, которую решает ваша идея"
        class-name="fs-6"
        :required="true"
      ></Textarea>
    </div>

    <div style="width: 50%">
      <Textarea
        v-model="ideaData.solution"
        name="resolveIdea"
        label="Предлагаемое решение*"
        placeholder="Опишите, что вы предлагаете для решения проблемы"
        class-name="fs-6"
      ></Textarea>
    </div>

    <div style="width: 50%">
      <Textarea
        v-model="ideaData.result"
        name="resultIdea"
        label="Ожидаемый результат*"
        placeholder="Опишите ожидаемый результат"
        class-name="fs-6"
      ></Textarea>
    </div>

    <CustomerAndContact />

    <div style="width: 50%">
      <Textarea
        v-model="ideaData.description"
        name="resourcesIdea"
        label="Описание необходимых ресурсов для реализации*"
        placeholder="Укажите список требуемых для выполнения проекта ресурсов"
        class-name="fs-6"
      ></Textarea>
    </div>
    <RatingCalculator @set-rating="setRatingEmit" />
    <Button
      class-name="btn-primary d-block mx-auto"
      @click="handleIdea"
      >Отправить на рассмотрение</Button
    >
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
</style>
