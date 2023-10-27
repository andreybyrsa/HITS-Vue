<script lang="ts" setup>
import { defineComponent, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@Store/user/userStore'
import { useForm } from 'vee-validate'

import Validation from '@Utils/Validation'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import { JoinIdeaModalEmits } from '@Components/Modals/JoinIdeaModal/JoinIdeaModal.types'
import JoinIdeaFormProps from '@Components/Forms/JoinIdeaForm/JoinIdeaForm.types'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Radio from '@Components/Inputs/Radio/Radio.vue'
import Icon from '@Components/Icon/Icon.vue'
import RequestTeams from '@Domain/RequestTeams'

import JoinIdea from '@Domain/JoinIdea'
import Team from '@Domain/Team'
import RequestTeamsServise from '@Services/RequestTeamsServise'
import ideaModalCollapses from '@Components/Modals/IdeaModal/IdeaModalCollapses'
import TeamPlaceholder from '../TeamForm/TeamPlaceholder.vue'

const props = defineProps<JoinIdeaFormProps>()

const emit = defineEmits<JoinIdeaModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const teams = defineModel<RequestTeams[]>({ required: true })
const textArea = ref<string>('')

function filterTeams(teams: Team[]) {
  return teams.filter((team) =>
    team.members.find((member) => member.email == user.value?.email),
  )
}

const chosenOption = ref<Team>(null)

const isChecked = computed(() => {
  return chosenOption.value !== null
})

const { handleSubmit } = useForm<JoinIdea>({
  validationSchema: {
    letter: (value: string) => value?.length > 0 || 'Поле не заполнено',
  },
})

// const handleSend = handleSubmit(async (values) => {
//   const response = values

//   if (response instanceof Error) {
//     return // notification
//   }
// })

function getBorderColor(option: string) {
  if (chosenOption.value?.id == option) {
    return 'border-primary'
  }
}

// const applicationTeam = ref<ApplicationTeams>({
//   id: 0,
//   ideaId: 1,
//   accepted: false,

//   name: 'Команда 0',
//   closed: false,
//   description:
//     'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
//   owner: users[1],
//   leader: users[2],
//   members: [users[3]],
//   skills: [...skills],
//   status: 'Ждут принятия',
//   changedDate: '2023-10-20T11:02:17Z',
//   letter:
//     'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorbeatae ipsum dicta omnis adipisci magni autem eos quisquam doloresmaxime. Dignissimos cum nulla consequatur accusantium distinctioaut. Velit, assumenda porro!',
// })

async function sendApplicationTeam(team: Team) {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const applicationTeam: RequestTeams = {
      id: team.id,
      ideaId: props.idea.id,
      accepted: false,
      name: team.name,
      closed: team.closed,
      description: team.description,
      owner: team.owner,
      leader: team.leader,
      members: team.members,
      skills: team.skills,
      status: 'Ждут принятия',
      changedDate: '2023-10-20T11:02:17Z',
      letter: textArea.value,
    }

    const response = await RequestTeamsServise.postRequest(applicationTeam, token)

    if (response instanceof Error) {
      return
    }

    teams.value.push(applicationTeam)
  }
}
</script>

<template>
  <div
    v-if="user?.email != idea?.initiator"
    class="join-modal p-3 rounded bg-white w-100"
  >
    <Typography class-name="fs-4 text-primary">Подать заявку</Typography>

    <div
      :class="`join-modal__me border ${getBorderColor('me')} rounded p-2 px-3 w-100`"
    >
      <div class="d-grid me-3">
        <Typography class-name="fs-5">Заявить себя</Typography>
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

    <div class="join-modal__teams w-100">
      <Typography class-name="border-bottom fs-5 text-secondary w-100"
        >Заявить команду
      </Typography>

      <div class="join-modal__teams-container">
        <div
          class="w-100"
          v-for="team in filterTeams(props.teamsFree)"
          :key="team.id"
        >
          <div
            :class="`join-modal__teams-block border shadow rounded-3 p-2 px-3 ${getBorderColor(
              team.id,
            )}`"
            v-if="team.closed == false"
          >
            <div class="d-grid gap-1 w-100">
              <div>
                <Button
                  class-name="fs-5"
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
                    :key="member.id"
                  >
                    {{ member.email }}
                  </div>
                </div>

                <Typography>Компетенции:</Typography>
                <div class="d-flex gap-2 flex-wrap">
                  <div
                    class="rounded-pill bg-light px-2 p-1 border"
                    v-for="skill in team.skills"
                    :key="skill.id"
                  >
                    {{ skill.name }}
                  </div>
                </div>
              </Collapse>
            </div>

            <Radio
              name="chose"
              title="Подать"
              :value="team"
              v-model="chosenOption"
              class-name="fs-5"
            ></Radio>
          </div>

          <div
            class="join-modal__teams-block border shadow rounded-3 p-2 px-3 bg-secondary bg-opacity-50"
            v-if="team.closed == true"
          >
            <div class="d-grid gap-1">
              <div>
                <Button
                  class-name="fs-5 text-light"
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
                    :key="member.id"
                  >
                    {{ member.email }}
                  </div>
                </div>

                <Typography>Компетенции:</Typography>
                <div class="d-flex gap-2 flex-wrap">
                  <div
                    class="rounded-pill bg-light px-2 p-1 border"
                    v-for="skill in team.skills"
                    :key="skill.id"
                  >
                    {{ skill.name }}
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
      <Typography class-name="border-bottom fs-5 text-secondary w-100"
        >Мотивационное письмо
      </Typography>

      <Textarea
        class-name="w-100 rounded-end mb-2"
        name="letter"
        validate-on-update
        v-model="textArea"
      />
    </div>

    <div
      class="w-100 d-flex justify-content-center"
      v-if="isChecked"
    >
      <Button
        class-name="bg-success text-light shadow rounded-pill ms-4 fs-5 w-75"
        @click="sendApplicationTeam(chosenOption)"
        >Подать</Button
      >
    </div>
  </div>
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

  // width: fit-content;
  max-height: 550px;
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
      width: 100%;
    }
    &-container {
      @include flexible(center, flex-start, column, $gap: 20px);
      width: 100%;
      height: 300px;
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
