<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Company, RolesTypes } from '@Domain'
import { useUserStore, useNotificationsStore } from '@Store'
import { CompanyService } from '@Service'
import {
  CustomerAndContact,
  CustomerAndContactEmits,
} from '@Components/Forms/IdeaForm/CustomerAndContact.types'
import { hints } from '@Components/Forms/IdeaForm/IdeaFormInputs.types'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'

const props = defineProps<CustomerAndContact>()
const emit = defineEmits<CustomerAndContactEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const companies = ref<Company[]>([])
const companiesNames = computed(() => companies.value.map((company) => company.name))

const companyContacts = ref<string[]>([])

async function getAllCompaniesByRole(role: RolesTypes) {
  const response = await CompanyService.getAll()

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

  if (currentUser?.role) {
    const { id, role } = currentUser

    if (role !== 'ADMIN') {
      const response = await CompanyService.getOwner(id)

      if (response instanceof Error) {
        return notificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      if (response.length === 0) {
        return getAllCompaniesByRole(role)
      }

      companies.value = response
    } else {
      getAllCompaniesByRole(role)
    }
  }
})

const getCompanyByName = (companyName: string) => {
  return companies.value.find((company) => company.name === companyName)
}

async function handleCustomerChange(selectedCompany: string) {
  const currentCompany = getCompanyByName(selectedCompany)

  if (currentCompany) {
    const response = await CompanyService.get(currentCompany.id)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    companyContacts.value = response.users.map(
      ({ firstName, lastName }) => `${firstName} ${lastName}`,
    )

    const isCorrectContactPerson = companyContacts.value.find(
      (user) => user === props.idea.contactPerson,
    )

    emit(
      'set-value',
      'contactPerson',
      isCorrectContactPerson ?? companyContacts.value[0],
    )
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
