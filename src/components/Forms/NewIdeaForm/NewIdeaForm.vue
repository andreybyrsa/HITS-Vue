<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import RatingCalculator from '@Components/Forms/NewIdeaForm/ratingCalculator.vue'
</script>

<template>
  <FormLayout class-name="align-items-start w-100 h-100 overflow-auto">
    <Typography class-name="fs-1 text-primary">Создание идеи</Typography>

    <div style="width: 50%">
      <Input
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
      <option>Внутренний</option>
      <option>Внешний</option>
      <option>Three</option>
    </select>

    <div style="width: 50%">
      <Input
        label="Проблема*"
        placeholder="Опишите проблему, которую решает ваша идея"
        class-name="fs-6 text-primary"
      ></Input>
    </div>

    <div style="width: 50%">
      <Input
        label="Предлагаемое решение*"
        placeholder="Опишите, что вы предлагаете для решения проблемы"
        class-name="fs-6 text-primary"
      ></Input>
    </div>

    <div style="width: 50%">
      <Input
        label="Ожидаемый результат*"
        placeholder="Опишите ожидаемый результат"
        class-name="fs-6 text-primary"
      ></Input>
    </div>

    <div style="width: 50%">
      <Input
        label="Заказчик*"
        placeholder="Укажите заказчика"
        class-name="fs-6 text-primary"
      ></Input>
    </div>

    <div style="width: 50%">
      <Input
        label="Описание необходимых ресурсов для реализации*"
        placeholder="Укажите список требуемых для выполнения проекта ресурсов"
        class-name="fs-6 text-primary"
      ></Input>
    </div>
    <RatingCalculator />
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
