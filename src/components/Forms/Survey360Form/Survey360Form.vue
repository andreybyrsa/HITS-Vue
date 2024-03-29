<script lang="ts" setup>
import {
  Survey360FormProps,
  Survey360FormEmits,
} from '@Components/Forms/Survey360Form/Survey360Form.types'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Button from '@Components/Button/Button.vue'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'

import { ref, computed, ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { watchImmediate } from '@vueuse/core'
import { Team } from '@Domain/Team'
import Validation from '@Utils/Validation'

const examplesNames = ['1', '2', '3']

const showHidden = ref(false)

const props = defineProps<Survey360FormProps>()
const emit = defineEmits<Survey360FormEmits>()

const isLoading = ref<boolean>(false)
</script>

<template>
  <div class="container-fluid d-flex flex-column vh-100">
    <div class="row">
      <div class="col-sm-12 d-flex align-items-center justify-content-between">
        <Typography class-name="fs-3 text-primary">Создание опроса</Typography>

        <Button
          variant="close"
          class="close"
          @click="emit('close-modal')"
        ></Button>
      </div>
    </div>
    <div class="row flex-grow-2">
      <div class="col-sm-4">
        <div class="p-4">
          <div class="w-100">
            <Combobox
              name="customer"
              label="Шаблон опроса"
              :options="examplesNames"
              placeholder="Выберите шаблон опроса"
            />
            <Checkbox
              name="showHidden"
              label="Показать скрытые"
              class="mt-1"
            />
            <div>
              <Input
                name="name"
                class-name="rounded-end"
                class="mt-3"
                label="Название опроса"
                validate-on-update
                placeholder="Введите название опроса"
              />
            </div>
            <div
              class="classcol-sm-12 d-flex align-items-center justify-content-between mt-3"
            >
              <Input
                name="startDate"
                class-name="rounded-end "
                class="me-2"
                label="Дата начала"
                type="date"
                validate-on-update
                placeholder=".. | .. | .."
              />
              <Input
                name="finishDate"
                class-name="rounded-end "
                label="Дата окончания"
                type="date"
                validate-on-update
                placeholder=".. | .. | .."
                class="ms-2"
              />
            </div>

            <Textarea
              name="goal"
              class-name="rounded-end"
              label="Описание опроса"
              validate-on-update
              placeholder=""
              class="mt-3"
            ></Textarea>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <Typography class-name="fs-5 text-primary">Вопросы</Typography>
        <div style="background-color: #f0f0f0; padding: 20px">Div 2</div>
      </div>
      <div
        data-bs-spy="scroll"
        class="col-sm-4"
      >
        <Typography class-name="fs-5 text-primary">Выбор команды</Typography>
        <div style="background-color: #f0f0f0; padding: 20px">Div 3</div>
      </div>
    </div>
    <div class="row justify-content-end">
      <div class="col-sm-12">
        <Button
          variant="primary"
          @click="emit('close-modal')"
          >Создать опрос</Button
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
