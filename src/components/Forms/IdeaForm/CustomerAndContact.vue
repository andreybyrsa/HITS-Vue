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
  { contacts: ['Красильников Сергей Владимирович'], company: 'ГК АВТОГРАД' },
  { contacts: ['Зайко Антон Алексеевич'], company: 'Студия дизайна PavlovaWeb' },
  { contacts: ['Красильников Сергей Владимирович'], company: 'ГК АВТОГРАД' },
  {
    contacts: [
      'Андрей Дрыгни (HR)',
      'Асташова Ксения (портфель проектов)',
      'Качанова Яна (проектный офис) ',
    ],
    company: 'ООО Цифровое строительство',
  },
  {
    contacts: ['Томилов Алексей Александрович'],
    company: 'ООО "Ребренди Консалтинг"',
  },
  { contacts: ['Громов Игорь Сергеевич'], company: 'ЗапСибНИИГГ' },
  {
    contacts: ['Беляков Дмитрий Константинович'],
    company: 'Базис-моторс',
  },
  {
    contacts: ['Беляков Дмитрий Константинович'],
    company: 'ООО "Бизнес-Аудит"',
  },
  {
    contacts: ['Букреев Павел Александрович'],
    company: '1C-Медицина-Регион',
  },
  {
    contacts: ['Золотов Анатолий Леонидович'],
    company: 'Tip-Top Studio',
  },
  {
    contacts: ['Николаев Алексей Андреевич', 'Исаев Сергей Викторович'],
    company: 'ООО "Зуммер"',
  },
  {
    contacts: ['Галагуш Артем Василич'],
    company: 'ООО Бизнес Технологии',
  },
  {
    contacts: ['Калашников Вячеслав Сергеевич'],
    company: 'ООО "ВОК"',
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
