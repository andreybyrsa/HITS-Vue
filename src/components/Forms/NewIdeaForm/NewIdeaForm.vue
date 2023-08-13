<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

const listRating = [
  'Высокий',
  'Выше среднего',
  'Средний',
  'Ниже стреднего',
  'Низкий',
]
</script>

<template>
  <FormLayout class-name="align-items-start w-100 h-100 overflow-auto">
    <Typography class-name="fs-1 text-primary">Создание идеи</Typography>

    <div style="width: 50%">
      <Input
        name="nameIdea"
        label="Название идеи*"
        placeholder="Введите название идеи"
        class-name="fs-6 text-primary"
      ></Input>
    </div>

    <Typography class-name="fs-6 text-primary">Тип проекта*</Typography>
    <select
      class="form-select w-50"
      aria-label="Floating label select example"
    >
      <option
        selected
        disabled
      >
        Выберите тип проекта
      </option>
      <option>One</option>
      <option>Two</option>
      <option>Three</option>
    </select>

    <div style="width: 50%">
      <Input
        name="problemIdea"
        label="Проблема*"
        placeholder="Опишите проблему, которую решает ваша идея"
        class-name="fs-6 text-primary"
      ></Input>
    </div>

    <div style="width: 50%">
      <Input
        name="resolveIdea"
        label="Предлагаемое решение*"
        placeholder="Опишите, что вы предлагаете для решения проблемы"
        class-name="fs-6 text-primary"
      ></Input>
    </div>

    <div style="width: 50%">
      <Input
        name="resultIdea"
        label="Ожидаемый результат*"
        placeholder="Опишите ожидаемый результат"
        class-name="fs-6 text-primary"
      ></Input>
    </div>

    <Typography class-name="fs-6 text-primary">Заказчик*</Typography>
    <select
      class="form-select w-50"
      aria-label="Floating label select example"
    >
      <option
        selected
        disabled
      >
        Выберите заказчика
      </option>

      <option>One</option>
      <option>Two</option>
      <option>Three</option>
    </select>

    <div style="width: 50%">
      <Input
        name="resourcesIdea"
        label="Описание необходимых ресурсов для реализации*"
        placeholder="Укажите список и количественную оценку требуемых для выполнения проекта ресурсов, включая: кол-во человек, компетенций, материальных ценностей, технических средств и т.п."
        class-name="fs-6 text-primary"
      ></Input>
    </div>

    <Typography class-name="fs-6 text-primary"
      >Предварительная оценка идеи</Typography
    >
    <div class="row w-100">
      <div class="col">
        <Typography class="fs-6 text-primary">Реализуемость*</Typography>
        <select
          class="form-select"
          aria-label="Floating label select example"
        >
          <option
            selected
            disabled
          >
            Выберите значение
          </option>
          <option
            v-for="list in listRating"
            :key="list"
          >
            {{ list }}
          </option>
        </select>
      </div>
      <div class="col">
        <Typography class="fs-6 text-primary">Пригодность*</Typography>
        <select
          class="form-select"
          aria-label="Floating label select example"
        >
          <option
            selected
            disabled
          >
            Выберите значение
          </option>
          <option
            v-for="list in listRating"
            :key="list"
          >
            {{ list }}
          </option>
        </select>
      </div>
      <div class="col">
        <Typography class="fs-6 text-primary">Бюджет*</Typography>
        <select
          class="form-select"
          aria-label="Floating label select example"
        >
          <option
            selected
            disabled
          >
            Выберите значение
          </option>
          <option
            v-for="list in listRating"
            :key="list"
          >
            {{ list }}
          </option>
        </select>
      </div>
    </div>

    <Typography class-name="fs-6 text-primary">Риск: 4</Typography>
    <Button class-name="btn-primary d-block mx-auto"
      >Отправить на рассмотрение</Button
    >
  </FormLayout>
</template>

<style lang="scss">
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
