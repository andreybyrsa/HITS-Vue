<script lang="ts" setup>
import {
  IdeaModalProps,
  IdeaModalEmits,
} from '@Components/Modals/IdeaModal/IdeaModal.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import ExchangeDescription from '@Components/Modals/ExchangeModal/ExchangeDescription.vue'
import ExchangeTeams from '@Components/Modals/ExchangeModal/ExchangeTeams.vue'
import ExchangeInfo from '@Components/Modals/ExchangeModal/ExchangeInfo.vue'
import ExchangeComments from '@Components/Modals/ExchangeModal/ExchangeComments.vue'

import Team from '@Domain/Team'
import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'

defineProps<IdeaModalProps>()

const emit = defineEmits<IdeaModalEmits>()

const Andrey: User = {
  id: 'Andrey',
  token: 'Andrey',
  email: 'Andrey@mail.com',
  firstName: 'Андрей',
  lastName: 'Бырса',
  skills: [
    {
      id: 'skillId1',
      skillId: 'skillId1',
      name: 'JavaScript',
      type: 'LANGUAGE',
      confirmed: false,
    },
  ],
  roles: ['INITIATOR'],
  role: 'INITIATOR',
  lastActivity: new Date(2023, 10, 10),
}

const Kirill: User = {
  id: 'Kirill',
  token: 'Kirill',
  email: 'Kirill@mail.com',
  firstName: 'Кирилл',
  lastName: 'Власов',
  skills: [
    {
      id: 'skillId2',
      skillId: 'skillId2',
      name: 'React',
      type: 'FRAMEWORK',
      confirmed: false,
    },
  ],
  roles: ['INITIATOR'],
  role: 'INITIATOR',
  lastActivity: new Date(2023, 10, 10),
}

const Timyr: User = {
  id: 'Timyr',
  token: 'Timyr',
  email: 'Timyr@mail.com',
  firstName: 'Тимур',
  lastName: 'Минязев',
  skills: [
    {
      id: 'skillId3',
      skillId: 'skillId3',
      name: 'Django',
      type: 'FRAMEWORK',
      confirmed: false,
    },
  ],
  roles: ['INITIATOR'],
  role: 'INITIATOR',
  lastActivity: new Date(2023, 10, 10),
}

const Mamed: User = {
  id: 'Mamed',
  token: 'Mamed',
  email: 'Mamed@mail.com',
  firstName: 'Мамедага',
  lastName: 'Байрамов',
  skills: [
    {
      id: 'skillId4',
      skillId: 'skillId4',
      name: 'MongoDB',
      type: 'DATABASE',
      confirmed: false,
    },
  ],
  roles: ['INITIATOR'],
  role: 'INITIATOR',
  lastActivity: new Date(2023, 10, 10),
}

const members: User[] = [
  Andrey,
  Kirill,
  Timyr,
  Timyr,
  Timyr,
  Timyr,
  Timyr,
  Timyr,
  Timyr,
  Timyr,
  Mamed,
]

const skills: Skill[] = [
  {
    id: 'skillId1',
    skillId: 'skillId1',
    name: 'JavaScript',
    type: 'LANGUAGE',
    confirmed: false,
  },
  {
    id: 'skillId2',
    skillId: 'skillId2',
    name: 'React',
    type: 'FRAMEWORK',
    confirmed: false,
  },
  {
    id: 'skillId4',
    skillId: 'skillId4',
    name: 'MongoDB',
    type: 'DATABASE',
    confirmed: false,
  },
]

const teams: Team[] = [
  {
    id: '1',
    name: 'Команда 1',
    description: 'Описание',
    closed: false,
    createdAt: new Date(2023, 10, 10),
    owner: Andrey,
    leader: Kirill,
    members: members,
    skills: skills,
  },
  {
    id: '2',
    name: 'Команда 2',
    description: 'Описание',
    closed: false,
    createdAt: new Date(2023, 10, 10),
    owner: Timyr,
    leader: Mamed,
    members: members,
    skills: skills,
  },
]

const idea = {
  id: '111',
  createdAt: new Date(2023, 10, 10),
  modifiedAt: new Date(2023, 10, 10),
  name: 'Название идеи',
  problem: 'Проблема идеи',
  description: 'Описание',
  solution: 'Решение',
  result: 'Результат',
  projectType: 'INSIDE',
  status: 'CONFIRMED',
  initiator: 'kirill.vlasov.05@inbox.ru',
  customer: 'ВШЦТ',

  technicalRealizability: 4,
}

function closeExchangeModal() {
  emit('close-modal')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeExchangeModal"
  >
    <div
      class="exchange-modal p-3 h-100 overflow-y-scroll"
      ref="ideaModalRef"
    >
      <div class="exchange-modal__left-side w-75">
        <ExchangeDescription
          :idea="idea"
          @close-modal="closeExchangeModal"
        />

        <ExchangeTeams
          :teams="teams"
          @close-modal="closeExchangeModal"
        />

        <ExchangeComments />
      </div>

      <div class="exchange-modal__right-side w-25 bg-white rounded">
        <ExchangeInfo :idea="idea" />
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.exchange-modal {
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
  }

  &__right-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .exchange-modal,
.modal-layout-leave-to .exchange-modal {
  transform: translateX(100%);
}
</style>
