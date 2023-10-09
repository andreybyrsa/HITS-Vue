<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import TeamForm from '@Components/Forms/TeamForm/TeamForm.vue'
import TeamFormPlaceholder from '@Components/Forms/TeamForm/TeamFormPlaceholder.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import Team from '@Domain/Team'

import TeamService from '@Services/TeamService'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const team = ref<Team>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = route.params
    const response = await TeamService.getTeam(id, token)
    // const response = (await new Promise((resolve) => setTimeout(resolve, 1000)).then(
    //   () => ({
    //     id: '1',
    //     name: 'Название команды 11111',
    //     description: 'Описание команды 11111',
    //     closed: true,
    //     owner: {
    //       id: '3',
    //       firstName: 'Кирилл',
    //       lastName: 'Власов',
    //       skills: [
    //         { id: '6', name: 'Java', type: 'LANGUAGE' },
    //         { id: '7', name: 'Vue', type: 'FRAMEWORK' },
    //         { id: '7', name: 'Vue', type: 'FRAMEWORK' },
    //         { id: '7', name: 'Vue', type: 'FRAMEWORK' },
    //         { id: '8', name: 'Angular', type: 'FRAMEWORK' },
    //         { id: '8', name: 'Angular', type: 'FRAMEWORK' },
    //         { id: '9', name: 'Git', type: 'DEVOPS' },
    //         { id: '10', name: 'SQL', type: 'DATABASE' },
    //         { id: '11', name: 'PostgreSQL', type: 'DATABASE' },
    //         { id: '12', name: 'Mongo', type: 'DATABASE' },
    //         { id: '12', name: 'Mongo', type: 'DATABASE' },
    //       ],
    //     },
    //     leader: {
    //       id: '1',
    //       firstName: 'Андрей',
    //       lastName: 'Бырса',
    //       skills: [
    //         { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
    //         { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
    //         { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
    //         { id: '2', name: 'TypeScript', type: 'LANGUAGE' },
    //         { id: '2', name: 'TypeScript', type: 'LANGUAGE' },
    //         { id: '3', name: 'React', type: 'FRAMEWORK' },
    //       ],
    //     },
    //     members: [
    //       {
    //         id: '1',
    //         firstName: 'Андрей',
    //         lastName: 'Бырса',
    //         skills: [
    //           { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
    //           { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
    //           { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
    //           { id: '2', name: 'TypeScript', type: 'LANGUAGE' },
    //           { id: '2', name: 'TypeScript', type: 'LANGUAGE' },
    //           { id: '3', name: 'React', type: 'FRAMEWORK' },
    //         ],
    //       },
    //       {
    //         id: '2',
    //         firstName: 'Тимур',
    //         lastName: 'Минязев',
    //         skills: [
    //           { id: '4', name: 'Docker', type: 'DEVOPS' },
    //           { id: '4', name: 'Docker', type: 'DEVOPS' },
    //           { id: '4', name: 'Docker', type: 'DEVOPS' },
    //           { id: '3', name: 'React', type: 'FRAMEWORK' },
    //           { id: '3', name: 'React', type: 'FRAMEWORK' },
    //           { id: '5', name: 'Django', type: 'FRAMEWORK' },
    //         ],
    //       },
    //       {
    //         id: '3',
    //         firstName: 'Кирилл',
    //         lastName: 'Власов',
    //         skills: [
    //           { id: '6', name: 'Java', type: 'LANGUAGE' },
    //           { id: '7', name: 'Vue', type: 'FRAMEWORK' },
    //           { id: '7', name: 'Vue', type: 'FRAMEWORK' },
    //           { id: '7', name: 'Vue', type: 'FRAMEWORK' },
    //           { id: '8', name: 'Angular', type: 'FRAMEWORK' },
    //           { id: '8', name: 'Angular', type: 'FRAMEWORK' },
    //           { id: '9', name: 'Git', type: 'DEVOPS' },
    //           { id: '10', name: 'SQL', type: 'DATABASE' },
    //           { id: '11', name: 'PostgreSQL', type: 'DATABASE' },
    //           { id: '12', name: 'Mongo', type: 'DATABASE' },
    //           { id: '12', name: 'Mongo', type: 'DATABASE' },
    //         ],
    //       },
    //       {
    //         id: '4',
    //         firstName: 'Мамед',
    //         lastName: 'Байрамов',
    //         skills: [
    //           { id: '13', name: 'C++', type: 'LANGUAGE' },
    //           { id: '13', name: 'C++', type: 'LANGUAGE' },
    //           { id: '14', name: 'Maven', type: 'DEVOPS' },
    //           { id: '14', name: 'Maven', type: 'DEVOPS' },
    //           { id: '3', name: 'React', type: 'FRAMEWORK' },
    //         ],
    //       },
    //     ],
    //   }),
    // )) as Team

    team.value = response
  }
})
</script>

<template>
  <PageLayout content-class-name="bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <TeamForm
        v-if="team"
        :team="team"
      />

      <TeamFormPlaceholder v-else />
    </template>
  </PageLayout>
</template>
