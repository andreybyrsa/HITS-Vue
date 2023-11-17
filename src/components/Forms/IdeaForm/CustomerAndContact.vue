<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import {
  CustomerAndContact,
  CustomerAndContactEmits,
} from '@Components/Forms/IdeaForm/CustomerAndContact.types'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import CompanyService from '@Services/CompanyService'
import Company from '@Domain/Company'

const props = defineProps<CustomerAndContact>()
const emit = defineEmits<CustomerAndContactEmits>()

// const customers = ref([
//   { contacts: ['ВШЦТ'], company: 'ВШЦТ' },
//   { contacts: ['Человек 1', 'Человек 2'], company: 'Роснефть' },
//   { contacts: ['Человек 3', 'Человек 4', 'Человек 5'], company: 'Газпром' },
//   {
//     contacts: ['Человек 6', 'Человек 7', 'Человек 8', 'Человек 9'],
//     company: 'Лукойл',
//   },
// ])

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const customers = ref<Company[]>([])

const currentCompanies = computed(() =>
  customers.value.map((company) => company.name),
)

const currentCompanyContacts = computed(() => {
  const selectedCompany = customers.value.find(
    (company) => company.name === props.idea.customer,
  )
  return selectedCompany ? getContactPersonsByCompany(props.idea.customer) : []
})

onMounted(async () => {
  const currentUser = user.value
  // if (currentUser?.token) {
  //   const { token } = currentUser
  //   const response = await CompanyService.getCompanies(token)

  //     if (response instanceof Error) {
  //       notificationsStore.createSystemNotification('Система', response.message)
  //     } else {
  //       customers.value = response
  //     }
  //   }
  // })
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await CompanyService.getCompanies(token)

    if (response instanceof Error) {
      notificationsStore.createSystemNotification('Система', response.message)
    } else {
      customers.value = response

      customers.value.forEach((company) => {
        if (company.users.some((user) => user.id === currentUser.id)) {
          emit('set-value', 'customer', company.name)
        }
      })
    }
  }
})

const getContactPersonsByCompany = (company: string): string[] => {
  const selectedCompany = customers.value.find((option) => option.name === company)
  return selectedCompany
    ? selectedCompany.users.map((user) => `${user.firstName} ${user.lastName}`)
    : []
}

function handleCustomerChange(selectedCompany: string) {
  const currentContacts = getContactPersonsByCompany(selectedCompany)
  if (currentContacts) {
    const { contactPerson } = props.idea

    const currentContactPerson = currentCompanyContacts.value.includes(contactPerson)
      ? contactPerson
      : currentContacts[0]

    if (typeof currentContactPerson === 'string') {
      emit('set-value', 'contactPerson', currentContactPerson)
    }
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

// const currentCompanies = ref<string[]>([])
// const currentCompanyContacts = ref<string[]>([])

// const currentCompanyContacts = computed(() => {
//   return customers.value.flatMap((company) =>
//     company.users.map((user) => user.firstName && user.lastName),
//   )
// })

// // const currentCompanyContacts = ref<string[]>([])
// // const currentCompanies = ref(customers.value.map((option) => option.name))

// function getContactPersonsByCompany(company: string) {
//   return customers.value.find((option) => option.name === company)
// }

// // function handleCustomerChange(selectedCompany: string) {
// //   const currentContacts = getContactPersonsByCompany(selectedCompany)?.users
// //   if (currentContacts) {
// //     const { contactPerson } = props.idea

// //     const currentContactPerson = currentCompanyContacts.value.includes(contactPerson)
// //       ? contactPerson
// //       : currentContacts[0]

// //     emit('set-value', 'contactPerson', currentContactPerson)
// //   }
// // }

// function handleCustomerChange(selectedCompany: string) {
//   const currentContacts = getContactPersonsByCompany(selectedCompany)?.users
//   if (currentContacts) {
//     const { contactPerson } = props.idea

//     const currentContactPerson = currentCompanyContacts.value.includes(contactPerson)
//       ? contactPerson
//       : currentContacts[0]

//     if (typeof currentContactPerson === 'string') {
//       emit('set-value', 'contactPerson', currentContactPerson)
//     }
//   }
// }
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
