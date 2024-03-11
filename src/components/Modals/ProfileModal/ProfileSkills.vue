<script lang="ts" setup>
import { ref, computed } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { Skill } from '@Domain'
import { useUserStore, useProfilesStore } from '@Store'
import { SkillsArea } from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.types'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import StackCategories from '@Components/StackCategories/StackCategories.vue'
import SkillsRadarCharts from '@Components/Charts/SkillsRadarChart/SkillsRadarChart.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()
const profileId = route.params.id.toString()

const profilesStore = useProfilesStore()
const profile = computed(() => profilesStore.getProfileByUserId(profileId))

const profileSkills = ref<SkillsArea[]>([])
const selectedSkills = ref<Skill[]>([])

const isOwnProfile = computed(() => profile.value?.email === user.value?.email)
const isUpdatingSkills = ref(false)

watchImmediate(
  () => profile.value?.skills,
  (skills) => {
    if (skills) {
      profileSkills.value = [
        { label: 'Фактические компетенции', skills, alphaOpacity: 50 },
      ]
    }
  },
  { deep: true },
)

function toogleUpdatingSkills(value: boolean) {
  isUpdatingSkills.value = value
}

const handleSaveSkills = async () => {
  const currentUser = user.value

  if (currentUser) {
    const { id } = currentUser

    await profilesStore
      .saveProfileSkills(id, selectedSkills.value)
      .then(() => toogleUpdatingSkills(false))
  }
}
</script>

<template>
  <div class="w-100 bg-white border p-3 rounded-3">
    <div class="header border-bottom pb-1">
      <Typography class-name="fs-5 text-primary">Компетенции</Typography>
      <Button
        v-if="!isUpdatingSkills && isOwnProfile"
        variant="light"
        @click="toogleUpdatingSkills(true)"
      >
        {{ profileSkills[0].skills.length ? 'Изменить стек' : 'Выбрать стек' }}
      </Button>

      <div
        class="d-flex gap-2"
        v-if="isUpdatingSkills"
      >
        <Button
          variant="primary"
          @click="handleSaveSkills"
        >
          Сохранить
        </Button>
        <Button
          variant="danger"
          @click="toogleUpdatingSkills(false)"
        >
          Отменить
        </Button>
      </div>
    </div>

    <StackCategories
      v-if="isUpdatingSkills"
      :skills="profileSkills[0].skills"
      v-model:stack="selectedSkills"
    />

    <div v-else>
      <SkillsRadarCharts
        v-if="profileSkills[0].skills.length"
        :skills="profileSkills"
      />
      <Typography
        v-else
        class-name="d-flex w-100 justify-content-center mt-3 fs-6 text-secondary"
      >
        Компетенции не выбраны
      </Typography>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content {
  width: 100%;
  @include flexible(flex-start, flex-start, column, $gap: 16px);

  &__skills {
    width: 50%;
    @include flexible(center, center);
  }

  &__categories {
    width: 100%;
    @include flexible(start, start);
  }

  &__technologies {
    @include flexible(center, flex-start, $flex-wrap: wrap, $gap: 4px);
  }
}
</style>
