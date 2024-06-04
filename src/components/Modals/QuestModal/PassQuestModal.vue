<script lang="ts" setup>
import { ComputedRef, computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  PassQuestProps,
  PassQuestEmits,
} from '@Components/Modals/QuestModal/PassQuestModal.type'
import useQuestTemplatesStore from '@Store/questTemplates/questTemplatesStore'
import useUserStore from '@Store/user/userStore'
import { Indicator, Quest, QuestResult } from '@Domain/Quest'
import useTeamStore from '@Store/teams/teamsStore'
import useProfilesStore from '@Store/profiles/profilesStore'
import Radio from '@Components/Inputs/Radio/Radio.vue'
import { useForm } from 'vee-validate'
import useQuestResultsStore from '@Store/questResults/questResultsStore'
import useQuestsStore from '@Store/quests/questsStore'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<PassQuestProps>()
const emit = defineEmits<PassQuestEmits>()

const isOpened = ref(true)

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const questTemplatesStore = useQuestTemplatesStore()
const { questTemplate } = storeToRefs(questTemplatesStore)

const teamStore = useTeamStore()
const { teams } = storeToRefs(teamStore)

const questResultsStore = useQuestResultsStore()

const questStore = useQuestsStore()
const { quests } = storeToRefs(questStore)

const profilesStore = useProfilesStore()

const currentIndicatorIndex = ref<number | null>(null)

const currentIndicator = computed(() => {
  if (currentIndicatorIndex.value == null || !indicators.value) return undefined
  return indicators.value[currentIndicatorIndex.value]
})

const results = ref<QuestResult[]>([])

const { setValues, values } = useForm<{ answer: string }>({})

onMounted(async () => {
  const id = route.params.id.toString()

  currentIndicatorIndex.value = null
  results.value = []

  const token = user.value?.token
  if (!token) return
  if (quests.value.length == 0) {
    const { id, role, token } = { ...user.value }
    if (!id || !role || !token) return
    if (role == 'PROJECT_OFFICE' && quests.value.length == 0) {
      await questStore.getQuestsForProjectOffice(token)
    } else if (quests.value.length == 0) {
      await questStore.getQuests(id, token)
    }
  }
  const idQuestTemplate = quests.value?.find(
    (quest) => quest.idQuest == id,
  )?.idQuestTemplate
  if (!idQuestTemplate) return
  await questTemplatesStore.getQuestTemplate(idQuestTemplate, token)
  await teamStore.getTeams(token)
})

const teamOfUser = computed(() => {
  return teams.value?.find((team) =>
    team.members?.find((someUser) => someUser.id == user.value?.id),
  )
})

const indicators: ComputedRef<Indicator[] | undefined> = computed(() => {
  const questIndicators = questTemplate.value?.indicators
  const token = user.value?.token
  if (!token) return

  const personalIndicators: Indicator[] = []

  questIndicators?.forEach(async (indicator) => {
    const userRole = user.value?.role
    if (indicator.fromRole != userRole) return

    if (indicator.toRole != 'TEAM-MEMBER') {
      personalIndicators.push(indicator)
      return
    }

    const teamProfiles = teamOfUser.value?.members.filter(
      (member) => member.id != user.value?.id,
    )

    if (!teamProfiles) return

    await teamProfiles.map(async (member) => {
      return await profilesStore.fetchUserProfile(member.id, token)
    })

    await teamProfiles?.forEach((profile) => {
      const newIndicator = {
        ...structuredClone(indicator),
        idToUser: profile.id,
      }
      newIndicator.name += ` ${profile.firstName} ${profile.lastName}`
      personalIndicators.push(newIndicator)
    })
  })

  return personalIndicators
})

const startQuest = () => {
  currentIndicatorIndex.value = 0
}

const nextQuestion = () => {
  const isQuestNotStart = currentIndicatorIndex.value == null
  const isLastIndicator =
    indicators.value && currentIndicatorIndex.value == indicators.value.length - 1
  const idQuest = route.params.id.toString()

  if (isQuestNotStart || isLastIndicator) return

  // if снизу нужен из-за того что ts не видит проверку в переменной isQuestNotStart
  if (currentIndicatorIndex.value == null) return

  // if снизу нужен!
  if (!currentIndicator.value?.id || !idQuest || !user.value?.id) {
    return
  }

  const newResult: QuestResult = {
    idIndicator: currentIndicator.value.id,
    idQuest: idQuest,
    idFromUser: user.value.id,
    value: values.answer.toString(),
    idToUser: `TEAM-${teamOfUser.value?.id}`,
  }

  if (currentIndicator.value.idToUser) {
    newResult.idToUser = currentIndicator.value.idToUser
  }
  results.value.push(newResult)
  currentIndicatorIndex.value += 1
  setValues({ answer: undefined })
}

const sendResults = async () => {
  const { id, role, token } = { ...user.value }
  if (!id || !role || !token) return

  await questResultsStore.postQuestResults(results.value, token)

  if (role == 'PROJECT_OFFICE' && quests.value.length == 0) {
    await questStore.getQuestsForProjectOffice(token)
  } else if (quests.value.length == 0) {
    await questStore.getQuests(id, token)
  }

  emit('close-modal')
}

const handleCloseProfileModal = () => {
  return router.push('/questionnaire')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="handleCloseProfileModal"
  >
    <div
      class="modal-360-quest bg-white rounded p-3 container-fluid d-flex flex-column h-fit"
    >
      <div class="row d-flex align-items-center justify-content-between w-100">
        <Typography class-name="fs-3 text-primary w-auto">{{
          questTemplate?.name
        }}</Typography>
        <Button
          variant="close"
          class="close"
          @click="handleCloseProfileModal"
        ></Button>
        <div class="border-bottom m--4 w-100"></div>
      </div>
      <div class="d-flex flex-column h-100 justify-content-between">
        <div class="d-flex col h-auto text-center">
          <p
            class="h-fit text-start"
            v-if="currentIndicatorIndex == null"
          >
            {{ questTemplate?.description }}. <br />
            В нем {{ questTemplate?.indicators.length }} вопросов. <br />
            Чтобы приступить к нему нажмите на кнопку ниже.
          </p>
          <div
            class="d-flex flex-column"
            v-else
          >
            <p class="fs-5 text-start">
              {{ currentIndicator?.name }}
            </p>
            <div
              class="d-flex"
              v-for="i in currentIndicator?.answers"
              :key="i"
            >
              <Radio
                name="answer"
                :value="i"
              />
              <p>{{ i }}</p>
            </div>
          </div>
        </div>
        <Button
          v-if="currentIndicatorIndex == null"
          @click="startQuest"
          variant="primary"
          class-name="w-fit h-auto align-self-end"
          >Начать опрос</Button
        >
        <Button
          v-else-if="
            currentIndicatorIndex ==
            (questTemplate?.indicators && questTemplate?.indicators.length - 1)
          "
          class-name="w-fit h-auto align-self-end"
          variant="primary"
          :disabled="!values.answer"
          @click="sendResults()"
          >Отправить ответы</Button
        >
        <Button
          v-else
          class-name="w-fit h-auto align-self-end"
          variant="primary"
          :disabled="!values.answer"
          @click="nextQuestion()"
          >Следующий вопрос</Button
        >
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.modal-360-quest {
  width: 40%;
  @include flexible(
    stretch,
    flex-start,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }
}

.max-height-textarea {
  resize: none;
}

.fixed-size-scroll-div {
  max-height: 55vh !important; /* ширину */
}
.text-question {
  word-break: break-word !important;
}
.w-fit {
  width: fit-content;
}

.h-fit {
  height: fit-content;
}

.m--4 {
  margin-left: 16px;
}
</style>
