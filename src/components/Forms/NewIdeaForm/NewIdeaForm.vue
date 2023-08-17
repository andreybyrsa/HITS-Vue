<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useFieldArray, useForm } from 'vee-validate'
import Validation from '@Utils/Validation'

import Typography from '@Components/Typography/Typography.vue'
import NewIdeaProps from '@Components/Forms/NewIdeaForm/NewIdeaForm.types'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import RatingCalculator from '@Components/Forms/NewIdeaForm/ratingCalculator.vue'
import CustomerAndContact from '@Components/Forms/NewIdeaForm/CustomerAndContact.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { Idea } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'
import RolesTypes from '@Domain/Roles'

const props = defineProps<NewIdeaProps>()

const router = useRouter()

const ideasStore = useIdeasStore()
const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const ideaData = reactive<Idea>({
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

function handlePostIdea(idea: Idea) {
  const currentUser = user.value

  if (currentUser?.token && validateForm()) {
    const { token } = currentUser
    ideasStore.postInitiatorIdeas(idea, token)
    router.push('/ideas')
  }
}

const formErrors = reactive({
  nameIdea: false,
  projectType: false,
  problemIdea: false,
  resolveIdea: false,
  resultIdea: false,
  resourcesIdea: false,
})
function validateForm() {
  formErrors.nameIdea = ideaData.name.trim() === ''
  formErrors.projectType = ideaData.projectType === ''
  formErrors.problemIdea = ideaData.problem.trim() === ''
  formErrors.resolveIdea = ideaData.solution.trim() === ''
  formErrors.resultIdea = ideaData.result.trim() === ''
  formErrors.resourcesIdea = ideaData.description.trim() === ''
  if (
    formErrors.nameIdea ||
    formErrors.projectType ||
    formErrors.problemIdea ||
    formErrors.resolveIdea ||
    formErrors.resultIdea ||
    formErrors.resourcesIdea
  ) {
    alert('Проверьте, что все поля заполнены!')
    return false
  }
  return true
}
</script>

<template>
  <FormLayout class-name="align-items-start w-100 h-100 overflow-auto">
    <Typography class-name="fs-1 text-primary">Создание идеи</Typography>
    <div style="width: 50%">
      <Input
        v-model="ideaData.name"
        name="nameIdea"
        label="Название идеи*"
        placeholder="Введите название идеи"
        class-name="fs-6"
        :error="formErrors.nameIdea"
      ></Input>
      <div
        v-if="formErrors.nameIdea"
        class="text-danger"
      >
        Поле не заполнено
      </div>
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
        :required="true"
        :error="formErrors.problemIdea"
      ></Input>
      <div
        v-if="formErrors.problemIdea"
        class="text-danger"
      >
        Поле не заполнено
      </div>
    </div>

    <div style="width: 50%">
      <Input
        v-model="ideaData.solution"
        name="resolveIdea"
        label="Предлагаемое решение*"
        placeholder="Опишите, что вы предлагаете для решения проблемы"
        class-name="fs-6"
        :error="formErrors.resolveIdea"
      ></Input>
      <div
        v-if="formErrors.resolveIdea"
        class="text-danger"
      >
        Поле не заполнено
      </div>
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

    <CustomerAndContact />

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
      class-name="btn-primary d-block mx-auto"
      @click="handlePostIdea(ideaData)"
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
