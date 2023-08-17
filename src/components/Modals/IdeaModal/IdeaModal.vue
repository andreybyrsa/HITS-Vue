<script lang="ts" setup>
import ModalLayout from '@Components/Modals/ModalLayout/ModalLayout.vue'
import {
  IdeaModalProps,
  IdeaModalEmits,
} from '@Components/Modals/IdeaModal/IdeaModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import ideaModalCollapses from '@Components/Modals/IdeaModal/IdeaModalCollapses'

import getStatus from '@Utils/getStatus'

defineProps<IdeaModalProps>()

const emit = defineEmits<IdeaModalEmits>()

const status = getStatus()
</script>

<template>
  <ModalLayout :is-opened="isOpened">
    <div class="idea-modal p-3 h-100 overflow-y-scroll">
      <div class="idea-modal__left-side w-75">
        <div class="idea-modal__left-side-header">
          <Button
            class-name="btn-primary"
            prepend-icon-name="bi bi-backspace-fill"
            @click="emit('close-modal')"
          >
            Назад
          </Button>

          <Typography
            class-name="p-2 w-100 bg-white rounded-3 fs-3 text-primary text-nowrap overflow-scroll"
          >
            {{ idea?.name }}
          </Typography>
        </div>

        <ul class="list-group rounded-3">
          <li
            v-for="collapse in ideaModalCollapses"
            :key="collapse.key"
            class="list-group-item p-0 overflow-hidden"
          >
            <Button
              :id="collapse.id"
              class-name="idea-modal__collapse-controller btn-light w-100"
              is-collapse-controller
            >
              {{ collapse.text }}
            </Button>
            <Collapse :id="collapse.id">
              {{ idea?.[collapse.ideaKey] }}
            </Collapse>
          </li>
        </ul>

        <div class="bg-white rounded-3">
          <div class="py-2 w-100 border-bottom">
            <Typography class-name="fs-5 px-3">Комментарии</Typography>
          </div>

          <div class="p-3 w-100"></div>

          <form class="idea-modal__comment-form pb-3 px-3">
            <Input
              name="comment-input"
              placeholder="Добавить комментарий"
            >
              <template #prepend>
                <i class="bi bi-chat"></i>
              </template>
            </Input>

            <Button
              type="submit"
              class-name="btn-primary"
            >
              Отправить
            </Button>
          </form>
        </div>
      </div>

      <div class="idea-modal__right-side w-25 bg-white rounded">
        <Typography
          v-if="idea"
          class-name="p-2 bg-primary rounded-top fs-3 text-center text-white"
        >
          {{ status.translatedStatus[idea.status] }}
        </Typography>

        <div class="idea-modal__idea-info px-3 w-100">
          <div class="w-100 pb-4">
            <div class="w-100 border-bottom">
              <Typography class="text-secondary">Заказчик</Typography>
            </div>

            <div class="p-3 fs-5">ВШЦТ</div>
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

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  &__left-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);

    &-header {
      @include flexible(stretch, flex-start, $gap: 16px);
    }
  }

  &__right-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }

  &__collapse-controller {
    border-radius: 0;
    background-color: $white-color;

    color: $primary-color;

    @include flexible(center, flex-start);
  }

  &__comment-form {
    @include flexible(stretch, flex-start, $gap: 16px);
  }

  transition: all 0.3s ease-out;
}

.modal-layout-enter-from .idea-modal,
.modal-layout-leave-to .idea-modal {
  transform: translateX(100%);
}
</style>
