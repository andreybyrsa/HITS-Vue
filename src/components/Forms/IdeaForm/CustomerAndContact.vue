<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'

import {
  CustomerAndContact,
  CustomerAndContactEmits,
} from '@Components/Forms/IdeaForm/CustomerAndContact.types'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'

import { User } from '@Domain/User'
import Company from '@Domain/Company'

const props = defineProps<CustomerAndContact>()
const emit = defineEmits<CustomerAndContactEmits>()

const companies = defineModel<Company[]>({
  required: true,
})

const currentCompanies = ref(companies.value.map((option) => option.name))
const currentCompanyContacts = ref<User[]>([])

function getContactPersonsByCompany(company: Company) {
  return companies.value.find((option) => option.name === company.name)
}

function handleCustomerChange(selectedCompany: Company) {
  const currentContacts = getContactPersonsByCompany(selectedCompany)?.users
  if (currentContacts) {
    currentCompanyContacts.value = currentContacts
    const { contactPerson } = props.idea

    const currentContactPerson = currentContacts.includes(contactPerson)
      ? contactPerson
      : currentContacts[0]

    emit('set-value', 'contactPerson', currentContactPerson)
  }
}

watchImmediate(
  () => props.idea.customer,
  (newCustomer) => {
    if (newCustomer) {
      handleCustomerChange(newCustomer)
    }
  },
)
</script>

<template>
  <div class="w-100">
    <Combobox
      name="customer"
      label="Заказчик*"
      :options="currentCompanies"
      placeholder="Выберите заказчика"
    />
  </div>

  <div class="w-100">
    <Combobox
      name="contactPerson"
      label="Контактное лицо*"
      :options="currentCompanyContacts"
      placeholder="Выберите контактное лицо"
    />
  </div>
</template>
