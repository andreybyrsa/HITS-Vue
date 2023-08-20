<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import RatingCalculator from '@Components/Forms/IdeaForm/RatingCalculator.vue'
import CustomerAndContact from '@Components/Forms/IdeaForm/CustomerAndContact.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import IdeaForm from '@Components/Forms/IdeaForm/IdeaForm.types'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { Idea } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'

const props = defineProps<IdeaForm>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasStore = useIdeasStore()

const router = useRouter()

const projectType = ref<'INSIDE' | 'OUTSIDE'>(
  props.idea?.projectType ?? 'INSIDE',
)
const customer = ref(props.idea?.customer ?? 'ВШЦТ')
const rating = ref(props.idea?.rating ?? 0)

function setCustomer(selectedCustomer: string) {
  customer.value = selectedCustomer
}

function setRating(calculatedRating: number) {
  rating.value = calculatedRating
}

const { handleSubmit } = useForm<Idea>({
  validationSchema: {
    name: (value: string) => value?.length > 0 || 'Поле не заполнено',
    problem: (value: string) => value?.length > 0 || 'Поле не заполнено',
    solution: (value: string) => value?.length > 0 || 'Поле не заполнено',
    result: (value: string) => value?.length > 0 || 'Поле не заполнено',
    description: (value: string) => value?.length > 0 || 'Поле не заполнено',
  },
  initialValues: {
    ...props.idea,
  },
})

const handleSaveIdea = handleSubmit(async (values) => {
  const currentUser = user.value
  const currentValues: Idea = {
    ...values,
    projectType: projectType.value,
    status: 'NEW',
    customer: customer.value,
    rating: rating.value,
  }

  if (currentUser?.token) {
    const { token } = currentUser

    if (props.idea) {
      const { id } = props.idea
      await ideasStore.putInitiatorIdeas(currentValues, id, token)
    } else {
      await ideasStore.postInitiatorIdeas(currentValues, token)
    }

    router.push('/ideas')
  }
})

const handleDeleteIdea = async () => {
  const currentUser = user.value
  if (currentUser?.token && props.idea) {
    const { token } = currentUser
    const { id } = props.idea
    await ideasStore.deleteInitiatorIdeas(id, token)

    router.push('/ideas')
  }
}
</script>

<template>
  <FormLayout class-name="align-items-start w-100 h-100 overflow-auto">
    <Typography class-name="fs-1 text-primary">
      {{ !idea ? 'Создание идеи' : 'Редактирование идеи' }}
    </Typography>

    <div class="w-50">
      <Input
        name="name"
        label="Название идеи*"
        class-name="fs-6"
        placeholder="Введите название идеи"
      />
    </div>

    <div class="w-50">
      <Typography class-name="fs-6 text-primary">Тип проекта*</Typography>
      <select
        class="form-select mt-2"
        v-model="projectType"
      >
        <option value="INSIDE">Внутренний</option>
        <option value="OUTSIDE">Внешний</option>
      </select>
    </div>

    <div class="w-50">
      <Textarea
        name="problem"
        label="Проблема*"
        class-name="fs-6"
        placeholder="Опишите проблему, которую решает ваша идея"
      ></Textarea>
    </div>

    <div class="w-50">
      <Textarea
        name="solution"
        label="Предлагаемое решение*"
        class-name="fs-6"
        placeholder="Опишите, что вы предлагаете для решения проблемы"
      ></Textarea>
    </div>

    <div class="w-50">
      <Textarea
        name="result"
        label="Ожидаемый результат*"
        class-name="fs-6"
        placeholder="Опишите ожидаемый результат"
      ></Textarea>
    </div>

    <CustomerAndContact @set-customer="setCustomer" />

    <div class="w-50">
      <Textarea
        name="description"
        label="Описание необходимых ресурсов для реализации*"
        class-name="fs-6"
        placeholder="Укажите список требуемых для выполнения проекта ресурсов"
      ></Textarea>
    </div>

    <RatingCalculator @set-rating="setRating" />

    <Button
      v-if="!idea"
      class-name="btn-primary d-block mx-auto"
      @click="handleSaveIdea"
    >
      Создать идею
    </Button>

    <div
      v-else
      class="d-flex gap-3 mx-auto"
    >
      <Button
        class-name="btn-primary"
        @click="handleSaveIdea"
      >
        Сохранить изменения
      </Button>
      <Button
        class-name="btn-danger"
        @click="handleDeleteIdea"
      >
        Удалить идею
      </Button>
    </div>
  </FormLayout>
</template>
