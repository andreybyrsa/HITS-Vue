<script lang="ts" setup>
import { ref, VueElement } from 'vue'
import { useForm } from 'vee-validate'
import { string } from 'yup'
import { storeToRefs } from 'pinia'
import { vIntersectionObserver } from '@vueuse/components'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import {
  IdeaModalProps,
  IdeaModalEmits,
} from '@Components/Modals/IdeaModal/IdeaModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import ideaModalCollapses from '@Components/Modals/IdeaModal/IdeaModalCollapses'
import CommentVue from '@Components/Comment/Comment.vue'
import Icon from '@Components/Icon/Icon.vue'

import Comment from '@Domain/Comment'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'

import getStatus from '@Utils/getStatus'

const props = defineProps<IdeaModalProps>()

const emit = defineEmits<IdeaModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasStore = useIdeasStore()

const status = getStatus()
const ideaModalRef = ref<VueElement>()

function checkIsUserComment(comment: Comment) {
  return user.value?.email === comment.sender
}

const { resetForm, handleSubmit } = useForm<Comment>({
  validationSchema: {
    comment: string().required('Поле обязательно к заполнению'),
  },
  initialValues: {
    comment: '',
    sender: user.value?.email,
    checkedBy: [`${user.value?.email}`],
  },
})

const handleAddComment = handleSubmit(async (values) => {
  const currentUser = user.value

  if (props.idea && currentUser?.token) {
    const { id } = props.idea
    const { token } = currentUser
    await ideasStore.addComment(values, id, token)

    resetForm()

    ideaModalRef.value?.scrollTo({
      top: ideaModalRef.value.scrollHeight,
      behavior: 'smooth',
    })
  }
})

const handleDeleteComment = async (commentID: number) => {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { id } = props.idea
    const { token } = currentUser

    await ideasStore.deleteComment(id, commentID, token)
  }
}

const handleCheckComment = async (
  ideaID: number,
  comment: Comment,
  token: string,
) => {
  await ideasStore.checkComment(ideaID, comment, token)
}

const onIntersectionObserver = async (
  [{ isIntersecting }]: IntersectionObserverEntry[],
  comment: Comment,
) => {
  const currentUser = user.value

  if (currentUser?.token && props.idea) {
    const { token, email } = currentUser
    const { id } = props.idea
    const checkedUsers = comment.checkedBy

    if (isIntersecting && !checkedUsers.includes(email)) {
      comment.checkedBy.push(email)

      await handleCheckComment(id, comment, token)
    }
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div
      ref="ideaModalRef"
      class="idea-modal p-3 h-100 overflow-y-scroll"
    >
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
            class-name="p-2 w-100 bg-white rounded-3 fs-4 text-primary text-nowrap overflow-scroll"
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
              <div class="p-2">
                {{ idea?.[collapse.ideaKey] }}
              </div>
            </Collapse>
          </li>
        </ul>

        <div class="bg-white rounded-3">
          <div class="py-2 w-100 border-bottom">
            <Typography class-name="fs-5 px-3">Комментарии</Typography>
          </div>

          <div
            v-if="idea?.comments"
            class="idea-modal__comments p-3 w-100"
          >
            <CommentVue
              v-for="comment in idea.comments"
              :key="comment.id"
              :class="checkIsUserComment(comment) && 'idea-modal__user-comment'"
              v-intersection-observer="
                (elem) => onIntersectionObserver(elem, comment)
              "
              :comment="comment"
              @delete-comment="handleDeleteComment(comment.id)"
            />
          </div>

          <form class="idea-modal__comment-form pb-3 px-3">
            <Input
              name="comment"
              placeholder="Добавить комментарий"
            >
              <template #prepend>
                <i class="bi bi-chat"></i>
              </template>
            </Input>

            <Button
              type="submit"
              class-name="btn-primary"
              @click="handleAddComment"
            >
              Отправить
            </Button>
          </form>
        </div>
      </div>

      <div class="idea-modal__right-side w-25 bg-white rounded">
        <Typography
          v-if="idea"
          class-name="p-2 bg-primary rounded-top fs-4 text-center text-white"
        >
          {{ status.translatedStatus[idea.status] }}
        </Typography>

        <div class="idea-modal__info px-3 pb-3 w-100">
          <div v-if="idea?.customer">
            <Typography class-name="border-bottom text-secondary d-block">
              Заказчик
            </Typography>

            <div class="idea-modal__info-user pt-2">
              <i class="bi bi-person-circle text-secondary fs-1 opacity-25"></i>

              <Typography class-name="text-primary">
                {{ idea?.customer }}
              </Typography>
            </div>
          </div>

          <div v-if="idea?.initiator">
            <Typography class-name="border-bottom text-secondary d-block">
              Инициатор
            </Typography>

            <div class="idea-modal__info-user pt-2">
              <i class="bi bi-person-circle text-secondary fs-1 opacity-25"></i>

              <Typography class-name="text-primary">
                {{ idea?.initiator }}
              </Typography>
            </div>
          </div>

          <div v-if="idea?.experts">
            <div
              class="idea-modal__info-header border-bottom pointers"
              data-bs-toggle="collapse"
              data-bs-target="#experts"
              aria-expanded="false"
            >
              <Typography class-name="text-secondary">Эксперты</Typography>

              <Icon class-name="bi bi-chevron-down me-2 fs-5 text-secondary" />
            </div>

            <Collapse id="experts">
              <div class="idea-modal__info-users py-2">
                <div
                  v-for="(value, index) in idea.experts"
                  :key="index"
                  class="idea-modal__info-user"
                >
                  <i class="bi bi-person-circle text-secondary fs-1 opacity-25"></i>

                  <Typography class-name="text-primary">
                    {{ value }}
                  </Typography>
                </div>
              </div>
            </Collapse>
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

  transition: all 0.3s ease-out;

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

  &__comments {
    display: grid;
    gap: 16px;
  }

  &__user-comment {
    justify-self: end;
  }

  &__comment-form {
    @include flexible(flex-start, flex-start, $gap: 16px);
  }

  &__info {
    @include flexible(stretch, flex-start, column, $gap: 16px);

    &-header {
      cursor: pointer;

      @include flexible(center, space-between);
    }

    &-users {
      @include flexible(stretch, flex-start, column, $gap: 8px);
    }

    &-user {
      @include flexible(center, flex-start, $gap: 8px);
    }
  }
}

.modal-layout-enter-from .idea-modal,
.modal-layout-leave-to .idea-modal {
  transform: translateX(100%);
}
</style>
