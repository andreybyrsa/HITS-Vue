<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { SkillType, Skill } from '@Domain/Skill'
import { storeToRefs } from 'pinia'
import SkillsService from '@Services/SkillService'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import Table from '@Components/Table/Table.vue'
import Radio from '@Components/Inputs/Radio/Radio.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Icon from '@Components/Icon/Icon.vue'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const currentSkillId = ref('')
const isOpenedDeleteModal = ref(false)

const searchValue = ref('')

const columns = [
  { key: 'name', label: 'Название' },
  { key: 'type', label: 'Тип' },
]

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await SkillsService.getAllSkills(token)

    const skillsArray = response
  }
})

const data = [
  {
    status: 'Утверждено',
    name: 'JavaScript',
    type: 'Language',
  },
  {
    status: 'На рассмотрении',
    name: 'Vue',
    type: 'Framework',
  },
  {
    status: 'Утверждено',
    name: 'SQL',
    type: 'Database',
  },
  {
    status: 'Утверждено',
    name: 'Shototam',
    type: 'Devops',
  },
]

const availableTypes = ['Language', 'Framework', 'Database', 'Devops']
const availableStatuses = ['Утверждено', 'На рассмотрении']

const searchedValue = defineModel<string>('searchValue', {
  required: true,
})
const filteredTypes = defineModel<SkillType[]>('filteredTypes', {
  required: true,
})

const filteredStatuses = defineModel<Skill[]>('filteredStatuses', {
  required: true,
})

function openDeleteSkillModal(id?: string) {
  isOpenedDeleteModal.value = true
  currentSkillId.value = id
}

function handleCloseDeleteModal() {
  isOpenedDeleteModal.value = false
}
</script>

<template>
  <form class="competencies-menu-form p-3 px-5">
    <Typography class-name="fs-2 text-primary text-center w-100">
      Справочник компетенций
    </Typography>
    <div class="competencies-menu-form__content w-100">
      <div class="competencies-menu-form__search">
        <div class="main p-2 mb-4 rounded bg-primary">
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
        </div>
      </div>
      <Table
        :columns="columns"
        :data="skillsArray"
        :search-value="searchValue"
        :filter-value="columns[0].key"
      >
        <template #status="{ item }">
          <Icon
            v-if="item.status == 'Утверждено'"
            class-name="icons bi bi-circle-fill text-success bg-light fs-6"
            title="Утверждено"
          />

          <Icon
            v-if="item.status == 'На рассмотрении'"
            class-name="icons bi bi-circle-fill text-danger bg-light fs-6"
            title="На рассмотрении"
          />
        </template>
        <template #actions="{ item }">
          <div>
            <Button
              class-name=" btn-primary fs-3 "
              prepend-icon-name="bi bi-list"
              is-drop-down-controller
            ></Button>
            <DropDown>
              <ul class="list-group list-group-flush">
                <li
                  v-if="item.status == 'Утверждено'"
                  class="list-group-item list-group-item-action p-1"
                >
                  <Button prepend-icon-name="bi bi-pencil-square text-primary"
                    >Редактировать</Button
                  >
                </li>
                <li
                  v-if="item.status == 'Утверждено'"
                  class="list-group-item list-group-item-action p-1"
                >
                  <Button
                    prepend-icon-name="bi bi-trash text-danger"
                    @click="openDeleteSkillModal"
                    >Удалить</Button
                  >
                </li>
                <li
                  v-if="item.status == 'На рассмотрении'"
                  class="list-group-item list-group-item-action p-1"
                >
                  <Button prepend-icon-name="bi bi-check-lg text-success fs-4"
                    >Одобрить</Button
                  >
                </li>
                <li
                  v-if="item.status == 'На рассмотрении'"
                  class="list-group-item list-group-item-action p-1"
                >
                  <Button prepend-icon-name="bi bi-x-lg text-danger "
                    >Отклонить</Button
                  >
                </li>
              </ul>
            </DropDown>
          </div>
        </template>
      </Table>
    </div>
    <DeleteModal
      :is-opened="isOpenedDeleteModal"
      @close-modal="handleCloseDeleteModal"
    />
  </form>
</template>

<style lang="scss" scoped>
.competencies-menu-form {
  width: 100%;
  height: 100%;

  @include flexible(center, flex-start, column, $gap: 18px);

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

.main {
  width: 80%;
}

.icons {
  background-color: black;
}
</style>
