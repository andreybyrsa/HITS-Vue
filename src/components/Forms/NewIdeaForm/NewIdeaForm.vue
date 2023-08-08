<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
</script>

<template>
  <FormLayout class-name="align-items-start w-100">
    <Typography class-name="fs-1 text-primary">Создание идеи</Typography>
    <Typography class-name="fs-6 text-primary">Название идеи*</Typography>
    <Input
      placeholder="Введите название идеи"
      class="w-50"
    ></Input>
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
    <Typography class-name="fs-6 text-primary">Проблема*</Typography>
    <Input
      placeholder="Опишите проблему, которую решает ваша идея"
      class="w-50"
    ></Input>
    <Typography class-name="fs-6 text-primary"
      >Предлагаемое решение*</Typography
    >
    <Input
      placeholder="Опишите, что вы предлагаете для решения проблемы"
      class="w-50"
    ></Input>
    <Typography class-name="fs-6 text-primary">Ожидаемый результат*</Typography>
    <Input
      placeholder="Опишите ожидаемый результат"
      class="w-50"
    ></Input>
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
    <Typography class-name="fs-6 text-primary"
      >Описание необходимых ресурсов для реализации*</Typography
    >
    <Input
      placeholder="Укажите список и количественную оценку требуемых для выполнения проекта ресурсов, включая: кол-во человек, компетенций, материальных ценностей, технических средств и т.п. "
      class="w-50"
    ></Input>
    <Typography class-name="fs-6 text-primary"
      >Предварительная оценка идеи</Typography
    >
    <div class="grid w-100">
      <Typography class="fs-6 w-25 text-primary">Реализуемость*</Typography>
      <select
        class="form-select w-25"
        aria-label="Floating label select example"
      >
        <option
          selected
          disabled
        >
          Выберите значение
        </option>
        <option>One</option>
        <option>Two</option>
        <option>Three</option>
      </select>
      <Typography class="fs-6 w-25 text-primary">Пригодность*</Typography>
      <select
        class="form-select w-25"
        aria-label="Floating label select example"
      >
        <option
          selected
          disabled
        >
          Выберите значение
        </option>
        <option>One</option>
        <option>Two</option>
        <option>Three</option>
      </select>
      <Typography class="fs-6 w-25 text-primary">Бюджет*</Typography>
      <select
        class="form-select w-25"
        aria-label="Floating label select example"
      >
        <option
          selected
          disabled
        >
          Выберите значение
        </option>
        <option>One</option>
        <option>Two</option>
        <option>Three</option>
      </select>
    </div>
    <Typography class-name="fs-6 text-primary">Риск</Typography>
  </FormLayout>
</template>

<style lang="scss"></style>
