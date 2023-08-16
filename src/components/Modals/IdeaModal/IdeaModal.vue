<script lang="ts" setup>
import ModalLayout from '@Components/Modals/ModalLayout/ModalLayout.vue'
import {
  IdeaModalProps,
  IdeaModalEmits,
} from '@Components/Modals/IdeaModal/IdeaModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'

defineProps<IdeaModalProps>()

const emit = defineEmits<IdeaModalEmits>()
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @close-modal="emit('close-modal')"
  >
    <div class="idea-modal p-3 h-100">
      <Button
        class-name="idea-modal__close-button btn-primary rounded-end-0"
        prepend-icon-name="bi bi-x-lg"
        @click="emit('close-modal')"
      >
        Закрыть
      </Button>

      <div class="w-75 h-100 flex">
        <div class="bg-white rounded p-2">
          <Typography class-name="fs-3 px-2 text-primary">
            Создание реактивного двигателя для ракеты
          </Typography>
        </div>

        <div class="collapse-container bg-white rounded">
          <Button
            id="problem"
            is-collapse-controller
            class="collapse-container__button border-bottom"
            >Проблема</Button
          >
          <Collapse id="problem">
            <pre>Слишком дорого</pre>
          </Collapse>
          <Button
            id="solution"
            is-collapse-controller
            class="collapse-container__button border-bottom"
            >Предлагаемое решение</Button
          >
          <Collapse id="solution"><pre>Уменьшить задачу</pre></Collapse>
          <Button
            id="result"
            is-collapse-controller
            class="collapse-container__button border-bottom"
            >Ожидаемый результат</Button
          >
          <Collapse id="result"><pre>Снижение затрат</pre></Collapse>
          <Button
            id="description"
            is-collapse-controller
            class="collapse-container__button border-bottom"
            >Описание необходимых ресурсов для реализации</Button
          >
          <Collapse id="description"><pre>Умы студентов </pre></Collapse>
        </div>

        <div class="comment-container bg-white rounded">
          <div class="w-100 border-bottom py-2">
            <Typography class-name="fs-5 px-3"> Комментарии </Typography>
          </div>
          <div class="user-comments p-3">11</div>
        </div>
      </div>
      <div class="bg-white rounded w-25 flex">
        <div class="header-container bg-primary">
          <Typography class-name="fs-4 text-light">Текущий статус</Typography>
        </div>
        <div class="header-roles px-3 py-4 w-100">
          <div class="w-100 pb-4">
            <div class="w-100 border-bottom">
              <Typography class="text-secondary">Заказчик</Typography>
            </div>

            <div class="p-3 fs-5">ВШЦТ</div>
          </div>

          <div class="w-100 pb-4">
            <div class="w-100 border-bottom">
              <Typography class="text-secondary">Инициатор</Typography>
            </div>

            <div class="p-3 fs-5">Виктор корнеплод</div>
          </div>

          <div class="w-100 pb-4">
            <div class="w-100 border-bottom">
              <Typography class="text-secondary">Эксперты</Typography>
            </div>

            <div class="p-3 fs-5">Ибрагим</div>
          </div>

          <div class="w-100 pb-4">
            <div class="w-100 border-bottom">
              <Typography class="text-secondary">Проектный офис</Typography>
            </div>

            <div class="p-3 fs-5">Василий Васильев</div>
          </div>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.idea-modal {
  position: relative;
  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;
  display: flex;

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  .collapse-container {
    margin-bottom: 16px;
    margin-top: 16px;
  }

  .collapse-container__button {
    border-radius: 0;
    width: 100%;
    justify-content: start;
  }

  .comment-container {
    height: 30%;
  }

  .header-container {
    border-radius: 8px 8px 0 0;
    height: 7%;
    justify-content: center;
    align-items: center;
    display: flex;
  }

  transition: all 0.3s ease-out;

  &__close-button {
    @include position(absolute, $top: 16px, $left: -135px);

    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
}

.modal-layout-enter-from .idea-modal,
.modal-layout-leave-to .idea-modal {
  transform: translateX(100%);
}
</style>
