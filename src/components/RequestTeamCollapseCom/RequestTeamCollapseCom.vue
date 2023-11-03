<script lang="ts" setup>
import { watch, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import {
  RequestTeamCollapseProps,
  RequestTeamCollapseEmits,
} from '@Components/RequestTeamCollapse/RequestTeamCollapse.types'

import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'

import Team from '@Domain/Team'
import { SkillType } from '@Domain/Skill'
import TeamsTable from '@Components/Tables/TeamsTable/TeamsTable.vue'
import { FieldEntry } from 'vee-validate'

const props = defineProps<RequestTeamCollapseProps>()
const emit = defineEmits<RequestTeamCollapseEmits>()
const router = useRouter()

const selectTeam = defineModel<Team>('selectTeam')
const letterTeam = defineModel<string>('letter')

function sendRequest(team: Team, index: number) {
  selectTeam.value = team
  letterTeam.value = props.fields[index].value
  emit('send-request')
}

function getTechnologyClassName(type: SkillType) {
  const className = 'px-2 py-1 rounded '

  switch (type) {
    case 'LANGUAGE':
      return className + ' bg-success-subtle text-success'
    case 'FRAMEWORK':
      return className + ' bg-info-subtle text-info'
    case 'DATABASE':
      return className + ' bg-warning-subtle text-warning'
    default:
      return className + ' bg-danger-subtle text-danger'
  }
}

onMounted(() => {
  for (let i = 0; i < props.teams.length; i++) {
    emit('push-letter', '')
  }
})

function sendOnPageCreateTeam() {
  router.push('/teams/create')
}

function filterFields(fields: FieldEntry<string>[], index: number) {
  return fields.filter((field) => field.key == index)
}

function getError(letter: string, index: number) {
  if (props.submitCount && letter.length == 0) {
    return 'Поле не заполнено'
  }
  return undefined
}
</script>

<template>
  <div
    v-if="teams.length"
    class="team-request-collapse w-100"
  >
    <div
      class="border rounded-3 py-1 px-2 overflow-hidden w-100"
      v-for="team in teams"
      :key="team.id"
    >
      <div class="team-request-collapse__button">
        <Button class-name="btn-link">
          {{ team.name }}
        </Button>
        <Button
          class-name="btn-primary"
          v-collapse="team.id"
        >
          Заполнить заявку
        </Button>
      </div>

      <Collapse :id="team.id">
        <div class="team-request-collapse__info py-1">
          <div class="w-100 d-flex p-2">
            <div class="w-50">
              <div class="text-primary pb-1">Состав:</div>
              <div class="d-flex flex-wrap gap-2">
                <div
                  class="p-1 rounded bg-light border"
                  v-for="member in team.members"
                  :key="member.id"
                >
                  {{ member.email }}
                </div>
              </div>
            </div>
            <div class="w-50 border-start ps-3 pb-1">
              <div class="text-primary pb-1">Компетенции:</div>
              <div class="d-flex flex-wrap gap-2">
                <div
                  v-for="skill in team.skills"
                  :key="skill.id"
                  :class="getTechnologyClassName(skill.type)"
                >
                  {{ skill.name }}
                </div>
              </div>
            </div>
          </div>

          <div
            v-for="(field, index) in fields"
            :key="index"
            class="w-100"
          >
            <Textarea
              v-if="index == teams.indexOf(team)"
              class-name="team-request-collapse__letter w-100 rounded-end"
              :name="`letter[${index}]`"
              :error="getError(field.value, index)"
            />
          </div>
          <Button
            class-name="btn-success"
            @click="sendRequest(team, teams.indexOf(team))"
          >
            Подать заявку
          </Button>
        </div>
      </Collapse>
    </div>
  </div>
  <div
    class="team-request-collapse__button w-100"
    v-else
  >
    <div class="text-danger">*Вы не являетесь владельцем команды</div>
    <Button
      class-name="btn-link"
      @click="sendOnPageCreateTeam"
    >
      Создать команду?
    </Button>
  </div>
</template>

<style lang="scss">
.team-request-collapse {
  @include flexible(flex-start, flex-start, column, $gap: 8px);

  &__button {
    @include flexible(center, space-between);
  }

  &__info {
    @include flexible(flex-start, flex-start, column, $gap: 8px);
  }

  &__letter {
    resize: none;
    height: 200px;
  }
}
</style>
