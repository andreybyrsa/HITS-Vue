<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'

import {
  CustomerAndContact,
  CustomerAndContactEmits,
} from '@Components/Forms/IdeaForm/CustomerAndContact.types'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'

const props = defineProps<CustomerAndContact>()
const emit = defineEmits<CustomerAndContactEmits>()

const customers = ref([
  { contacts: ['ВШЦТ'], company: 'ВШЦТ' },
  { contacts: ['Человек 1', 'Человек 2'], company: 'Роснефть' },
  { contacts: ['Человек 3', 'Человек 4', 'Человек 5'], company: 'Газпром' },
  {
    contacts: ['Человек 6', 'Человек 7', 'Человек 8', 'Человек 9'],
    company: 'Лукойл',
  },
])
const currentCompanies = ref(customers.value.map((option) => option.company))
const currentCompanyContacts = ref<string[]>([])

function getContactPersonsByCompany(company: string) {
  return customers.value.find((option) => option.company === company)
}

function handleCustomerChange(selectedCompany: string) {
  const currentContacts = getContactPersonsByCompany(selectedCompany)?.contacts
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
