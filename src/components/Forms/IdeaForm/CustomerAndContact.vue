<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

import {
  CustomerAndContact,
  CustomerAndContactEmits,
} from '@Components/Forms/IdeaForm/CustomerAndContact.types'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import { hints } from '@Components/Forms/IdeaForm/IdeaFormInputs.types'

import Company from '@Domain/Company'
import RolesTypes from '@Domain/Roles'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import CompanyService from '@Services/CompanyService'

const props = defineProps<CustomerAndContact>()
const emit = defineEmits<CustomerAndContactEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const companies = ref<Company[]>([])
const companiesNames = computed(() => companies.value.map((company) => company.name))

const companyContacts = ref<string[]>([])

async function getAllCompaniesByRole(token: string, role: RolesTypes) {
  const response = await CompanyService.getCompanies(token)

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  if (role === 'ADMIN') {
    companies.value = response
  } else {
    companies.value = response.filter((company) => company.name === 'ВШЦТ')
  }
}

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token && currentUser.role) {
    const { token, id, role } = currentUser

    if (role !== 'ADMIN') {
      const response = await CompanyService.getOwnerCompanies(id, token)

      if (response instanceof Error) {
        return getAllCompaniesByRole(token, role)
      }

      companies.value = response
    } else {
      getAllCompaniesByRole(token, role)
    }
  }
})

const getCompanyByName = (companyName: string) => {
  return companies.value.find((company) => company.name === companyName)
}

async function handleCustomerChange(selectedCompany: string) {
  const currentUser = user.value
  const currentCompany = getCompanyByName(selectedCompany)

  if (currentUser?.token && currentCompany) {
    const response = await CompanyService.getCompany(
      currentCompany.id,
      currentUser.token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    companyContacts.value = response.users.map(
      ({ firstName, lastName }) => `${firstName} ${lastName}`,
    )

    emit('set-value', 'contactPerson', companyContacts.value[0])
  }
}

watch(
  [() => props.idea.customer, companies],
  ([choosenCompany]) => {
    if (choosenCompany) {
      handleCustomerChange(choosenCompany)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="w-100">
    <Combobox
      name="customer"
      label="Заказчик*"
      :options="companiesNames"
      placeholder="Выберите заказчика"
      :hint="hints.customer"
    />
  </div>

  <div
    v-if="companyContacts.length"
    class="w-100"
  >
    <Combobox
      name="contactPerson"
      label="Контактное лицо*"
      :options="companyContacts"
      placeholder="Выберите контактное лицо"
    />
  </div>
</template>
