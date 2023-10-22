<script lang="ts" setup>
import {
  ExchangeModalProps,
  ExchangeModalEmits,
} from '@Components/Modals/ExchangeModal/ExchangeModal.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import ExchangeDescription from '@Components/Modals/ExchangeModal/ExchangeDescription.vue'
import ExchangeTeams from '@Components/Modals/ExchangeModal/ExchangeTeams.vue'
import ExchangeInfo from '@Components/Modals/ExchangeModal/ExchangeInfo.vue'
import ExchangeComments from '@Components/Modals/ExchangeModal/ExchangeComments.vue'

import Team from '@Domain/Team'
import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Idea } from '@Domain/Idea'

defineProps<ExchangeModalProps>()

const emit = defineEmits<ExchangeModalEmits>()

const Andrey: User = {
  id: 0,
  token: 'Andrey',
  email: 'Andrey@mail.com',
  firstName: 'Андрей',
  lastName: 'Бырса',
  roles: ['INITIATOR'],
  role: 'INITIATOR',
  lastActivity: new Date(2023, 10, 10),
}

const Kirill: User = {
  id: 1,
  token: 'Kirill',
  email: 'Kirill@mail.com',
  firstName: 'Кирилл',
  lastName: 'Власов',
  roles: ['INITIATOR'],
  role: 'INITIATOR',
  lastActivity: new Date(2023, 10, 10),
}

const Timyr: User = {
  id: 2,
  token: 'Timyr',
  email: 'Timyr@mail.com',
  firstName: 'Тимур',
  lastName: 'Минязев',
  roles: ['INITIATOR'],
  role: 'INITIATOR',
  lastActivity: new Date(2023, 10, 10),
}

const Mamed: User = {
  id: 3,
  token: 'Mamed',
  email: 'Mamed@mail.com',
  firstName: 'Мамедага',
  lastName: 'Байрамов',
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
    id: 0,
    name: 'JavaScript',
    type: 'LANGUAGE',
    confirmed: false,
  },
  {
    id: 1,
    name: 'React',
    type: 'FRAMEWORK',
    confirmed: false,
  },
  {
    id: 2,
    name: 'MongoDB',
    type: 'DATABASE',
    confirmed: false,
  },
]

const teams: Team[] = [
  {
    id: 1,
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
    id: 2,
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
  id: 0,
  initiator: 'admin@mail.com',
  name: 'Идея по созданию идеи',
  projectType: 'INSIDE',
  problem:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
  solution:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
  result:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
  createdAt: new Date(),
  modifiedAt: new Date(),
  status: 'ON_CONFIRMATION',
  customer: 'ВШЦТ',
  contactPerson: 'ВШЦТ',
  experts: null,
  projectOffice: null,
  budget: 1,
  suitability: 1,
  technicalRealizability: 1,
  preAssessment: 1,
  rating: 8 / 5,
} as Idea

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
