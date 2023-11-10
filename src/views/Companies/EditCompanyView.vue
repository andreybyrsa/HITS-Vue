<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import CompanyForm from '@Components/Forms/CompanyForm/CompanyForm.vue'
import CompanyFormPlaceholder from '@Components/Forms/CompanyForm/CompanyFormPlaceholder.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import Company from '@Domain/Company'

import CompanyService from '@Services/CompanyService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const route = useRoute()

const company = ref<Company>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const companyId = +route.params.id

    const response = await CompanyService.getCompany(companyId, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    company.value = response
  }
})
</script>

<template>
  <PageLayout content-class-name="bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <CompanyForm
        v-if="company"
        :company="company"
      />

      <CompanyFormPlaceholder v-else />
    </template>
  </PageLayout>
</template>
