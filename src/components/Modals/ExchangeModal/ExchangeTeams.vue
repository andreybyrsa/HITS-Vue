<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Typography from '@Components/Typography/Typography.vue'
import SkillsRadarCharts from '@Components/Forms/TeamForm/SkillsRadarCharts.vue'

import { ExchangeTeamsProps } from '@Components/Modals/ExchangeModal/ExchangeModal.types'
import { Skill } from '@Domain/Skill'

defineProps<ExchangeTeamsProps>()

const skills: Skill[] = [
  {
    id: 'skillId1',
    name: 'JavaScript',
    type: 'LANGUAGE',
    confirmed: false,
  },
  {
    id: 'skillId2',
    name: 'React',
    type: 'FRAMEWORK',
    confirmed: false,
  },
]

const radarSkills = [
  {
    id: '65231b1a67f40e1605d252c4',
    skillId: '6523153967f40e1605d252c3',
    userEmail: 'kirill.vlasov.05@inbox.ru',
    type: 'FRAMEWORK',
    name: 'React',
    level: 'POSSES',
  },
  {
    id: '65233c1267f40e1605d252da',
    skillId: '65233afd67f40e1605d252cf',
    userEmail: 'kirill.vlasov.05@inbox.ru',
    type: 'LANGUAGE',
    name: 'JavaScript',
    level: 'POSSES',
  },
  {
    id: '65233c1267f40e1605d252db',
    skillId: '65233b3167f40e1605d252d3',
    userEmail: 'kirill.vlasov.05@inbox.ru',
    type: 'FRAMEWORK',
    name: 'Vue',
    level: 'POSSES',
  },
  {
    id: '65233c1267f40e1605d252dd',
    skillId: '65233b4567f40e1605d252d5',
    userEmail: 'kirill.vlasov.05@inbox.ru',
    type: 'LANGUAGE',
    name: 'Python',
    level: 'POSSES',
  },
  {
    id: '65233c1267f40e1605d252dc',
    skillId: '6523152d67f40e1605d252c2',
    userEmail: 'kirill.vlasov.05@inbox.ru',
    type: 'LANGUAGE',
    name: 'Java',
    level: 'POSSES',
  },
  {
    id: '65233e3c67f40e1605d252e9',
    skillId: '65233b3167f40e1605d252d3',
    userEmail: 'mamed@inbox.ru',
    type: 'FRAMEWORK',
    name: 'Vue',
    level: 'PROFESSIONAL',
  },
  {
    id: '65233e3c67f40e1605d252eb',
    skillId: '65233b2367f40e1605d252d1',
    userEmail: 'mamed@inbox.ru',
    type: 'DATABASE',
    name: 'MongoDB',
    level: 'PROFESSIONAL',
  },
  {
    id: '65233e3c67f40e1605d252ec',
    skillId: '6523152d67f40e1605d252c2',
    userEmail: 'mamed@inbox.ru',
    type: 'LANGUAGE',
    name: 'Java',
    level: 'POSSES',
  },
  {
    id: '65233e3c67f40e1605d252ed',
    skillId: '65233b4567f40e1605d252d5',
    userEmail: 'mamed@inbox.ru',
    type: 'LANGUAGE',
    name: 'Python',
    level: 'PROFESSIONAL',
  },
  {
    id: '65233e3c67f40e1605d252ea',
    skillId: '65233b2867f40e1605d252d2',
    userEmail: 'mamed@inbox.ru',
    type: 'DATABASE',
    name: 'SQL',
    level: 'POSSES',
  },
  {
    id: '65231b9467f40e1605d252c7',
    skillId: '6523152d67f40e1605d252c2',
    userEmail: 'timur@inbox.ru',
    type: 'LANGUAGE',
    name: 'Java',
    level: 'POSSES',
  },
  {
    id: '65233baf67f40e1605d252d6',
    skillId: '65233b2367f40e1605d252d1',
    userEmail: 'timur@inbox.ru',
    type: 'DATABASE',
    name: 'MongoDB',
    level: 'POSSES',
  },
  {
    id: '65233baf67f40e1605d252d8',
    skillId: '6523152d67f40e1605d252c2',
    userEmail: 'timur@inbox.ru',
    type: 'LANGUAGE',
    name: 'Java',
    level: 'POSSES',
  },
  {
    id: '65233baf67f40e1605d252d7',
    skillId: '65233b0467f40e1605d252d0',
    userEmail: 'timur@inbox.ru',
    type: 'DEVOPS',
    name: 'Docker',
    level: 'POSSES',
  },
  {
    id: '65233baf67f40e1605d252d9',
    skillId: '65233b3f67f40e1605d252d4',
    userEmail: 'timur@inbox.ru',
    type: 'FRAMEWORK',
    name: 'Django',
    level: 'POSSES',
  },
]
</script>

<template>
  <div class="exchange-teams">
    <li class="list-group-item p-0 overflow-hidden">
      <Button
        class-name="collapse-controller btn-light w-100 rounded-3 fs-5"
        v-collapse="'collapse'"
      >
        Список команд
      </Button>
    </li>

    <Collapse :id="'collapse'">
      <ul class="list-group rounded-3">
        <li
          v-for="team in teams"
          :key="team.id"
          class="list-group-item p-0 overflow-hidden"
        >
          <Button
            class-name="collapse-controller btn-light w-100"
            v-collapse="team?.id"
          >
            {{ team.name }}
          </Button>

          <Collapse :id="team?.id">
            <div class="exchange-teams__team w-100">
              <div class="ddd w-50 p-2 overflow-y-scroll">
                <div
                  v-for="member in team.members"
                  :key="member.id"
                  class="exchange-teams__team-members"
                >
                  <div class="d-flex">
                    <Typography class-name="p-1 text-nowrap">
                      {{ member.firstName }} {{ member.lastName }}
                    </Typography>
                    <Typography
                      v-if="member.id == team.leader.id"
                      class-name="p-1 text-nowrap"
                      >(Лидер)
                    </Typography>
                  </div>
                </div>
              </div>
              <div class="exchange-teams__team-skills w-50">
                <div class="exchange-teams__team-skill bg-warning">a</div>
                <div class="exchange-teams__team-skill bg-warning">b</div>
                <div class="exchange-teams__team-skill bg-warning">c</div>
                <div class="exchange-teams__team-skill bg-warning">d</div>
                <!-- <SkillsRadarCharts :skills="skills" /> -->
              </div>
            </div>
          </Collapse>
        </li>
      </ul>
    </Collapse>
  </div>
</template>

<style lang="scss" scoped>
.ddd {
  height: 300px;
}
.exchange-teams {
  @include flexible(stretch, flex-start, column, $gap: 6px);

  &__team {
    @include flexible(flex-start, space-between);

    &-members {
      @include flexible(flex-start, flex-start, column);
    }

    &-skills {
      @include flexible(flex-start, center, $gap: 30px);
      flex-wrap: wrap;

      margin-top: 15px;
      margin-bottom: 15px;
    }

    &-skill {
      @include flexible(center, center);
      width: 120px;
      height: 120px;
    }
  }
}
.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
</style>
