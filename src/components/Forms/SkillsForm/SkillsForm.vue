<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import Table from '@Components/Table/Table.vue'
import Radio from '@Components/Inputs/Radio/Radio.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Icon from '@Components/Icon/Icon.vue'
import SkillModal from '@Components/Modals/SkillModal/SkillModal.vue'

import { SkillType, Skill } from '@Domain/Skill'

import SkillsService from '@Services/SkillService'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const skills = ref<Skill[]>()
const updatingSkill = ref<Skill | null>(null)
const currentDeleteSkillId = ref<number | null>(null)

const isOpenedDeletingModal = ref(false)
const isOpenCreatingSkillModal = ref(false)
const isOpenUpdatingSkillModal = ref(false)

const searchValue = ref('')

const columns = [
  { key: 'name', label: 'Название' },
  { key: 'type', label: 'Тип' },
]

const availableTypes = ['Language', 'Framework', 'Database', 'Devops']
const availableStatuses = ['Утверждено', 'На рассмотрении']

const filteredTypes = defineModel<SkillType[]>('filteredTypes', {
  required: true,
})
const filteredStatuses = defineModel<Skill[]>('filteredStatuses', {
  required: true,
})

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseSkill = await SkillsService.getAllSkills(token)

    if (responseSkill instanceof Error) {
      return // notification
    }

    skills.value = responseSkill
  }
})

const handleConfirmSkill = async (skill: Skill, id: number) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await SkillsService.confirmSkill(
      { ...skill, confirmed: true },
      id,
      token,
    )

    if (response instanceof Error) {
      return // notification
    }

    const currentSkill = skills.value?.find((skill) => skill.id === id)

    if (currentSkill) {
      currentSkill.confirmed = true
    }
  }
}

const handleDeleteSkill = async () => {
  const currentUser = user.value

  if (currentUser?.token && currentDeleteSkillId.value) {
    const { token } = currentUser
    const response = await SkillsService.deleteSkill(
      currentDeleteSkillId.value,
      token,
    )

    if (response instanceof Error) {
      return // notification
    }

    const currentSkillIndex = skills.value?.findIndex(
      (skill) => skill.id === currentDeleteSkillId.value,
    )

    if (currentSkillIndex !== undefined && currentSkillIndex !== -1) {
      skills.value?.splice(currentSkillIndex, 1)
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
  updatingSkill.value = null
  isOpenUpdatingSkillModal.value = false
}

function openDeletingModal(id: number) {
  currentDeleteSkillId.value = id
  isOpenedDeletingModal.value = true
}
function closeDeletingModal() {
  currentDeleteSkillId.value = null
  isOpenedDeletingModal.value = false
}
</script>

<template>
  <form
    v-if="skills"
    class="competencies-menu-form p-3 px-3"
  >
    <Typography class-name="fs-2 text-primary text-center w-100">
      Справочник компетенций
    </Typography>

    <div class="competencies-menu-form__content w-100">
      <div class="competencies-menu-form__search">
        <div class="search-bar p-2 mb-3 rounded bg-primary d-flex">
          <Input
            name="search"
            v-model="searchValue"
            placeholder="Поиск по компетенциям"
          >
            <template #append>
              <Button
                class-name="px-2 py-0"
                append-icon-name="bi bi-chevron-down"
                is-drop-down-controller
                drop-down-clickable-inside
                prepend-icon-name="bi bi-funnel-fill"
              >
                Фильтры
              </Button>

              <DropDown>
                <Button
                  class="competencies-menu-form__collapses border w-100 border-primary pointers"
                  data-bs-toggle="collapse"
                  data-bs-target="#types"
                  aria-expanded="false"
                >
                  <Typography>Типы</Typography>
                </Button>

                <Collapse id="types">
                  <div
                    v-for="(type, index) in availableTypes"
                    :key="index"
                  >
                    <Radio
                      name="checkboxRole"
                      :label="type"
                      v-model="filteredTypes"
                      :value="type"
                    />
                  </div>
                </Collapse>

                <Button
                  class="competencies-menu-form__collapses border w-100 border-primary pointers"
                  data-bs-toggle="collapse"
                  data-bs-target="#status"
                  aria-expanded="false"
                >
                  <Typography>Статус</Typography>
                </Button>

                <Collapse id="status">
                  <div
                    v-for="(status, index) in availableStatuses"
                    :key="index"
                  >
                    <Radio
                      name="checkboxRole"
                      :label="status"
                      v-model="filteredStatuses"
                      :value="status"
                    />
                  </div>
                </Collapse>
              </DropDown>
            </template>
          </Input>
          <Button
            class-name="btn-light px-2 py-2 border shadow h-100 ms-2"
            @click="openCreatingSkillModal"
            prepend-icon-name="bi bi-plus-lg"
          >
            Добавить
          </Button>
        </div>
      </div>

      <Table
        :columns="columns"
        :data="skills"
        :search-value="searchValue"
        :filter-value="columns[0].key"
      >
        <template #status="{ item }">
          <Icon
            v-if="item.confirmed == true"
            class-name="icons bi bi-circle-fill text-success bg-light fs-6"
            title="Утверждено"
          />

          <Icon
            v-if="item.confirmed == false"
            class-name="icons bi bi-circle-fill text-danger bg-light fs-6"
            title="На рассмотрении"
          />
        </template>

        <template #actions="{ item }: { item: Skill }">
          <Button
            class-name="btn-primary fs-3 "
            prepend-icon-name="bi bi-list"
            v-dropdown="`skill-controller-${item.id}`"
          ></Button>
          <DropDown>
            <ul class="list-group list-group-flush">
              <li
                v-if="item.confirmed"
                class="list-group-item list-group-item-action p-1"
                @click="openUpdatingSkillModal(item)"
              >
                Редактировать
              </li>

              <li
                v-if="item.confirmed === false"
                class="list-group-item list-group-item-action p-1"
                @click="handleConfirmSkill(item, item.id)"
              >
                Одобрить
              </li>

              <li
                class="list-group-item list-group-item-action p-1"
                @click="openDeletingModal(item.id)"
              >
                Удалить
              </li>
            </ul>
          </DropDown>
        </template>
      </Table>
    </div>

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
      @close-modal="closeDeletingModal"
      @delete="handleDeleteSkill"
    />
  </form>
</template>

<style lang="scss" scoped>
.competencies-menu-form {
  width: 100%;
  height: 100%;

  @include flexible(center, flex-start, column, $gap: 16px);

  &__content {
    height: 100vh;
    @include flexible(stretch, flex-start, column);
  }

  &__search {
    width: 100%;
    @include flexible(flex-start, center);
  }

  &__scroll {
    width: 100%;
    @include flexible(center, center, column);
  }

  &__competencie {
    width: 60%;
    height: 70px;
    border-radius: 18px;
    margin-bottom: 18px;
    background-color: rgb(255, 255, 255);
  }
  &__collapses {
    border-radius: 8px 8px 0 0;
  }
  &__collapses:last-of-type {
    border-radius: 0 0 8px 8px;
  }
}

.search-bar {
  width: 80%;
  @include flexible(center, stretch, $gap: 3);
}
</style>
