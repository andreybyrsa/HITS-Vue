<script lang="ts" setup>
import { defineComponent, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@Store/user/userStore'
import { useForm } from 'vee-validate'

import Validation from '@Utils/Validation'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import {
  JoinIdeaModalProps,
  JoinIdeaModalEmits,
} from '@Components/Modals/JoinIdeaModal/JoinIdeaModal.types'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Radio from '@Components/Inputs/Radio/Radio.vue'
import Icon from '@Components/Icon/Icon.vue'

import JoinIdea from '@Domain/JoinIdea'

defineProps<JoinIdeaModalProps>()

const emit = defineEmits<JoinIdeaModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const teams = [
  {
    id: '13342',
    name: 'Утята',
    members: ['Вадим', 'Саня', 'Никита', 'Стас', 'Вадим', 'Саня', 'Никита', 'Стас'],
    skills: ['SQL 3/8', 'Jaba 3/8', 'Rust 6/8', 'Assebler 1/8'],
    status: true,
  },
  {
    id: '79332',
    name: 'Бобрята',
    members: ['Андрей', 'Саня', 'Дима', 'Стас', 'Вадим Вадимович', 'Коля'],
    skills: ['Vue 1/6', 'Jaba 4/6', 'Mongo 2/6'],
    status: true,
  },
  {
    id: '743555',
    name: 'Никитосики',
    members: ['Никита', 'Никитос', 'Ника Минаш', 'Никитаз', 'Никадим', 'Никак'],
    skills: ['React 2/6', 'Java 3/6', ' Dota 6/6'],
    status: false,
  },
]

const chosenOption = ref<string | null>(null)

const isChecked = computed(() => {
  return chosenOption.value !== null
})

const { handleSubmit } = useForm<JoinIdea>({
  validationSchema: {
    letter: (value: string) => value?.length > 0 || 'Поле не заполнено',
  },
})

const handleSend = handleSubmit(async (values) => {
  const response = values

  if (response instanceof Error) {
    return // notification
  }
})

function getBorderColor(option: string) {
  if (chosenOption.value === option) {
    return 'border-primary'
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div
      v-if="isOpened"
      class="join-modal p-3 rounded bg-white"
    >
      <Typography class-name="fs-2 text-primary">Подать заявку</Typography>

      <div :class="`join-modal__me border ${getBorderColor('me')} rounded p-2 px-3`">
        <div class="d-grid me-3">
          <Typography class-name="fs-4">Заявить себя</Typography>
          <Typography>Подать заявку на вступление от себя</Typography>
        </div>
        <Radio
          name="chose"
          title="Подать"
          value="me"
          v-model="chosenOption"
          class-name="fs-5 ms-1"
        ></Radio>
      </div>

      <div class="join-modal__teams">
        <div class="text-muted border-bottom w-100">
          <Typography class-name="text-dark fs-4">Заявить команду</Typography>
        </div>

        <div class="join-modal__teams-container p-3">
          <div
            v-for="team in teams"
            :key="team"
          >
            <div
              :class="`join-modal__teams-block border  shadow rounded-3 p-2 px-3 ${getBorderColor(
                team.id,
              )}`"
              v-if="team.status == true"
            >
              <div class="d-grid gap-1">
                <div>
                  <Button
                    class-name="fs-4"
                    v-collapse="team.id"
                    ><i class="bi bi-caret-down"></i> {{ team.name }}
                  </Button>
                </div>

                <Collapse :id="team.id">
                  <Typography>Состав:</Typography>
                  <div class="d-flex gap-2 flex-wrap">
                    <div
                      class="rounded-pill bg-light px-2 p-1 border"
                      v-for="member in team.members"
                      :key="member"
                    >
                      {{ member }}
                    </div>
                  </div>

                  <Typography>Компетенции:</Typography>
                  <div class="d-flex gap-2 flex-wrap">
                    <div
                      class="rounded-pill bg-light px-2 p-1 border"
                      v-for="skill in team.skills"
                      :key="skill"
                    >
                      {{ skill }}
                    </div>
                  </div>
                </Collapse>
              </div>

              <Radio
                name="chose"
                title="Подать"
                :value="team.id"
                v-model="chosenOption"
                class-name="fs-5"
              ></Radio>
            </div>

            <div
              class="join-modal__teams-block border shadow rounded-3 p-2 px-3 bg-secondary bg-opacity-50"
              v-if="team.status == false"
            >
              <div class="d-grid gap-1">
                <div>
                  <Button
                    class-name="fs-4 text-light"
                    v-collapse="team.id"
                    ><i class="bi bi-caret-down"></i> {{ team.name }}
                  </Button>
                </div>
                <Collapse :id="team.id">
                  <Typography>Состав:</Typography>
                  <div class="d-flex gap-2 flex-wrap">
                    <div
                      class="rounded-pill bg-light px-2 p-1 border"
                      v-for="member in team.members"
                      :key="member"
                    >
                      {{ member }}
                    </div>
                  </div>

                  <Typography>Компетенции:</Typography>
                  <div class="d-flex gap-2 flex-wrap">
                    <div
                      class="rounded-pill bg-light px-2 p-1 border"
                      v-for="skill in team.skills"
                      :key="skill"
                    >
                      {{ skill }}
                    </div>
                  </div>
                </Collapse>
              </div>

              <Icon
                class-name="bi bi-patch-question text-light fs-4 me-2"
                v-tooltip="'Эта команда недоступна'"
              ></Icon>
            </div>
          </div>
        </div>
      </div>

      <div
        class="join-modal__letter"
        v-if="isChecked"
      >
        <div class="text-muted border-bottom w-100">
          <Typography class-name="text-dark fs-4">Мотивационное письмо</Typography>
        </div>

        <Textarea
          class-name="w-100 rounded-end mb-2"
          name="letter"
          validate-on-update
        ></Textarea>
      </div>

      <div
        class="w-100 d-flex justify-content-end pe-3"
        v-if="isChecked"
      >
        <Button
          class-name="bg-success text-light shadow rounded-pill ms-4 fs-5"
          @click="handleSend"
          >Подать</Button
        >
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.join-modal {
  @include flexible(
    center,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  width: fit-content;
  max-height: 80%;
  overflow-y: auto;

  &__me {
    width: 90%;
    @include flexible(center, space-between);
  }

  &__teams {
    @include flexible(center, flex-start, column, $gap: 20px);
    width: 100%;
    max-height: 400px;

    &-block {
      @include flexible(center, space-between);
      width: 500px;
    }
    &-container {
      @include flexible(center, flex-start, column, $gap: 20px);
      width: 100%;
      height: 100%;
      overflow-y: scroll;
    }
  }

  &__letter {
    @include flexible(center, flex-start, column, $gap: 12px);
    width: 100%;
  }

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .role-modal,
.modal-layout-leave-to .role-modal {
  transform: scale(0.9);
}

.selected {
  border-color: #0d6efd;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(209, 209, 209);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb {
  background-color: #2c81ff;
  border-radius: 20px;
  border: 3px solid #2c81ff;
}
</style>
