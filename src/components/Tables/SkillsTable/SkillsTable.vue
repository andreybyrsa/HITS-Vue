<template>
  <Table
    class-name="p-3"
    :header="skillsTableHeader"
    :columns="skillTableColumns"
    :data="skills"
    :search-by="['name']"
    :filters="skillsFilters"
    :dropdown-actions-menu="dropdownSkillsActions"
  />

  <SkillModal
    :is-opened="isOpenCreatingSkillModal"
    v-model="skills"
    @close-modal="closeCreatingSkillModal"
  />
  <SkillModal
    :is-opened="isOpenUpdatingSkillModal"
    :skill="updatingSkill"
    v-model="skills"
    @close-modal="closeUpdatingSkillModal"
  />

  <DeleteModal
    :is-opened="isOpenedDeletingModal"
    :item-name="currentDeleteSkillName"
    @close-modal="closeDeletingModal"
    @delete="handleDeleteSkill"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import Table from '@Components/Table/Table.vue'
import SkillModal from '@Components/Modals/SkillModal/SkillModal.vue'
import {
  TableColumn,
  DropdownMenuAction,
  TableHeader,
} from '@Components/Table/Table.types'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'

import { Skill, SkillType } from '@Domain/Skill'

import SkillsService from '@Services/SkillsService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { getSkillsInfo, getSkillInfoStyle } from '@Utils/skillsInfo'

const skills = defineModel<Skill[]>({ required: true })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const updatingSkill = ref<Skill | null>(null)
const currentDeleteSkillId = ref<string | null>(null)
const currentDeleteSkillName = ref<string>()

const isOpenCreatingSkillModal = ref(false)
const isOpenUpdatingSkillModal = ref(false)
const isOpenedDeletingModal = ref(false)

const filterByType = ref<SkillType[]>([])
const filterByIsConfirmed = ref<boolean>()

const availableSkills = getSkillsInfo()

const skillsTableHeader: TableHeader = {
  label: 'Список компетенций',
  countData: true,
  buttons: [
    {
      label: 'Добавить компетенцию',
      variant: 'primary',
      prependIconName: 'bi bi-plus-lg',
      click: openCreatingSkillModal,
    },
  ],
}

const skillTableColumns: TableColumn<Skill>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-4',
    rowCellClick: openUpdatingSkillModal,
  },
  {
    key: 'type',
    label: 'Категория',
    size: 'col-4',
    getRowCellFormat: getSkillTypeFormat,
    getRowCellStyle: getSkillTypeStyle,
  },
  {
    key: 'confirmed',
    label: 'Статус',
    size: 'col-4',
    getRowCellFormat: getSkillStatusFormat,
    getRowCellStyle: getSkillStatusStyle,
  },
]

const dropdownSkillsActions: DropdownMenuAction<Skill>[] = [
  {
    label: 'Редактировать',
    statement: (skill) => checkSkillConfirmed(skill, true),
    click: openUpdatingSkillModal,
  },
  {
    label: 'Утвердить',
    statement: (skill) => checkSkillConfirmed(skill, false),
    click: handleConfirmSkill,
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    click: openDeletingModal,
  },
]

const skillsFilters: Filter<Skill>[] = [
  {
    category: 'Категория',
    choices: availableSkills.skills.map((skillType) => ({
      label: availableSkills.translatedSkills[skillType],
      value: skillType,
    })),
    refValue: filterByType,
    isUniqueChoice: false,
    checkFilter: checkSkillType,
  },
  {
    category: 'Статус',
    choices: [
      { label: 'Утверждена', value: true },
      { label: 'На рассмотрении', value: false },
    ],
    refValue: filterByIsConfirmed,
    isUniqueChoice: true,
    checkFilter: checkSkillConfirmed,
  },
]

function getSkillTypeFormat(skillType: SkillType) {
  return availableSkills.translatedSkills[skillType]
}

function getSkillStatusFormat(isConfirmed: boolean) {
  if (isConfirmed) {
    return 'Утверждена'
  }
  return 'На рассмотрении'
}

function getSkillTypeStyle(skillType: SkillType) {
  const skillTypeClass = getSkillInfoStyle(skillType)

  return ['px-2', 'py-1', 'rounded-4', ...skillTypeClass]
}

function getSkillStatusStyle(isConfirmed: boolean) {
  if (!isConfirmed) {
    return 'text-danger'
  }
}

function checkSkillType(skill: Skill, value: FilterValue) {
  return skill.type === value
}
function checkSkillConfirmed(skill: Skill, value: FilterValue) {
  return skill.confirmed === value
}

async function handleConfirmSkill(skill: Skill) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = skill
    const response = await SkillsService.confirmSkill(
      { ...skill, confirmed: true },
      id,
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const currentSkill = skills.value.find((skill) => skill.id === id)

    if (currentSkill) {
      currentSkill.confirmed = true
    }
  }
}

const handleDeleteSkill = async () => {
  const currentUser = user.value

  if (currentUser?.token && currentDeleteSkillId.value !== null) {
    const { token } = currentUser
    const response = await SkillsService.deleteSkill(
      currentDeleteSkillId.value,
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const currentSkillIndex = skills.value.findIndex(
      (skill) => skill.id === currentDeleteSkillId.value,
    )

    if (currentSkillIndex !== -1) {
      skills.value.splice(currentSkillIndex, 1)
    }
  }
}

function openCreatingSkillModal() {
  isOpenCreatingSkillModal.value = true
}
function closeCreatingSkillModal() {
  isOpenCreatingSkillModal.value = false
}

function openUpdatingSkillModal(skill: Skill) {
  updatingSkill.value = skill
  isOpenUpdatingSkillModal.value = true
}
function closeUpdatingSkillModal() {
  isOpenUpdatingSkillModal.value = false
}

function openDeletingModal(skill: Skill) {
  currentDeleteSkillId.value = skill.id
  currentDeleteSkillName.value = skill.name
  isOpenedDeletingModal.value = true
}
function closeDeletingModal() {
  isOpenedDeletingModal.value = false
}
</script>
