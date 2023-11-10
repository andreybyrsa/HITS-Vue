<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFieldValue } from 'vee-validate'

import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import CompanyPlaceholder from '@Components/Forms/CompanyForm/CompanyPlaceholder.vue'

import CompanyService from '@Services/CompanyService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { User } from '@Domain/User'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const users = ref<User[]>()
const owner = ref<User | undefined>(useFieldValue<User>('owner').value)
const members = ref<User[]>(useFieldValue<User[]>('members').value ?? [])

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await CompanyService.getCompanyMembers(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    users.value = response

    if (!owner.value) {
      const currentOwner = response.find((user) => user.email === currentUser.email)

      if (currentOwner) {
        owner.value = currentOwner
      }
    }
  }
})

watch(
  owner,
  (currenOwner, prevOwner) => {
    if (currenOwner) {
      const isExistOwner = members.value.find(
        (member) => member.email === currenOwner.email,
      )

      if (!isExistOwner) {
        const prevOwnerIndex = members.value.findIndex(
          (member) => member.email === prevOwner?.email,
        )
        if (prevOwnerIndex !== -1) {
          members.value.splice(prevOwnerIndex, 1)
        }

        members.value.push(currenOwner)
      }
    }
  },
  { immediate: true },
)

function onUnselectMember(unselectedMember: User) {
  if (unselectedMember.email === owner.value?.email) {
    owner.value = undefined
  }
  if (unselectedMember.email === owner.value?.email) {
    owner.value = undefined
  }
}

function unselectMember(unselectedMember: User) {
  const currentMemberIndex = members.value.findIndex(
    (member) => member.email === unselectedMember.email,
  )

  if (currentMemberIndex !== -1) {
    members.value.splice(currentMemberIndex, 1)

    onUnselectMember(unselectedMember)
  }
}

function getMemberColor(member: User) {
  const memberClassName = 'company__member p-1 rounded-3 bg-opacity-25 '
  return member.email !== owner.value?.email
    ? memberClassName + 'bg-primary'
    : memberClassName + 'bg-danger'
}
</script>

<template>
  <div
    v-if="users"
    class="company w-100"
  >
    <Combobox
      name="owner"
      label="Владелец компании*"
      :options="users"
      :display-by="['firstName', 'lastName']"
      v-model="owner"
      placeholder="Выберите владельца"
    />

    <div class="w-100 d-flex gap-3">
      <div class="w-50 d-flex flex-column">
        <Combobox
          name="members"
          label="Представители компании*"
          :options="users"
          :display-by="['firstName', 'lastName']"
          v-model="members"
          placeholder="Выберите представителей"
          multiselect-placeholder="В компании"
          @on-unselect="onUnselectMember"
        />

        <div class="company__members mt-2">
          <div
            v-for="(member, index) in members.sort((member) =>
              member.email === owner?.email ? -1 : 1,
            )"
            :key="index"
            :class="getMemberColor(member)"
          >
            <Typography>{{ member.firstName }} {{ member.lastName }}</Typography>
            <Icon
              class-name="company__member-delete-icon bi bi-x-lg"
              @click="unselectMember(member)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <CompanyPlaceholder v-else />
</template>

<style lang="scss" scoped>
.company {
  @include flexible(stretch, flex-start, column, $gap: 16px);

  &__members {
    @include flexible(flex-start, flex-start, $flex-wrap: wrap, $gap: 8px);
  }

  &__member {
    @include flexible(center, center, $gap: 4px);

    &-delete-icon {
      cursor: pointer;
    }

    &-placeholder {
      width: 100px;
    }
  }
}
</style>
