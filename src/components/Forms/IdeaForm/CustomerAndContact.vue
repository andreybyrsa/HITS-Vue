<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import {
  CustomerAndContact,
  CustomerAndContactEmits,
} from '@Components/Forms/IdeaForm/CustomerAndContact.types'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'

import Company from '@Domain/Company'
import RolesTypes from '@Domain/Roles'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import CompanyService from '@Services/CompanyService'

const props = defineProps<CustomerAndContact>()
const emit = defineEmits<CustomerAndContactEmits>()

// const userStore = useUserStore()
// const { user } = storeToRefs(userStore)
// const notificationsStore = useNotificationsStore()

// const customers = ref<Company[]>([])
// const currentCompanies = computed(() =>
//   customers.value.map((company) => company.name),
// )

// const currentCompanyContacts = computed(() => {
//   const selectedCompany = customers.value.find(
//     (company) => company.name === props.idea.customer,
//   )
//   return selectedCompany ? getContactPersonsByCompany(props.idea.customer) : []
// })

// async function setCompaniesByRole(token: string, role: RolesTypes) {
//   const response = await CompanyService.getCompanies(token)

//   if (response instanceof Error) {
//     return notificationsStore.createSystemNotification('Система', response.message)
//   }

//   if (role === 'ADMIN') {
//     customers.value = response
//   } else {
//     customers.value = response.filter((company) => company.name === 'ВШЦТ')
//   }
// }

// onMounted(async () => {
//   const currentUser = user.value

//   if (currentUser?.token && currentUser.role) {
//     const { token, id, role } = currentUser

//     if (role !== 'ADMIN') {
//       const response = await CompanyService.getOwnerCompanies(id, token)

//       if (response instanceof Error) {
//         return notificationsStore.createSystemNotification(
//           'Система',
//           response.message,
//         )
//       }

//       if (response.length) {
//         customers.value = response
//       } else {
//         setCompaniesByRole(token, role)
//       }
//     } else {
//       setCompaniesByRole(token, role)
//     }
//   }
// })

// const getContactPersonsByCompany = (company: string): string[] => {
//   const selectedCompany = customers.value.find((option) => option.name === company)
//   return selectedCompany
//     ? selectedCompany.users.map((user) => `${user.firstName} ${user.lastName}`)
//     : []
// }

// function handleCustomerChange(selectedCompany: string) {
//   const currentContacts = getContactPersonsByCompany(selectedCompany)
//   if (currentContacts) {
//     const { contactPerson } = props.idea

//     const currentContactPerson = currentCompanyContacts.value.includes(contactPerson)
//       ? contactPerson
//       : currentContacts[0]

//     emit('set-value', 'contactPerson', currentContactPerson)
//   }
// }

const customers = ref([
  { contacts: ['ВШЦТ'], company: 'ВШЦТ' },
  { contacts: ['Красильников Сергей Владимирович'], company: 'ГК АВТОГРАД' },
  { contacts: ['Зайко Антон Алексеевич'], company: 'Студия дизайна PavlovaWeb' },
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
