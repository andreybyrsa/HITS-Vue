<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { vIntersectionObserver } from '@vueuse/components'

import { IdeaMarketAdvertsProps } from '@Components/Modals/IdeaMarketModal/IdeaMarketModal.types'
import MarketAdvertisementsPlaceholder from '@Components/Modals/IdeaMarketModal/IdeaMarketModalPlaceholder.vue'
import Advertisement from '@Components/Advertisement/Advertisement.vue'
import AdvertisementsForm from '@Components/Forms/AdvertisementsForm/AdvertisementsForm.vue'
import { Action } from '@Components/ActionsList/ActionsList.types'

import { IdeaMarketAdvertisement } from '@Domain/IdeaMarket'

import useUserStore from '@Store/user/userStore'
import useIdeaMarketAdvertisementsStore from '@Store/ideaMarketAdvertisements/ideaMarketAdvertisementsStore'

const props = defineProps<IdeaMarketAdvertsProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideaMarketAdvertisementsStore = useIdeaMarketAdvertisementsStore()
const { ideaMarketAdvertisements } = storeToRefs(ideaMarketAdvertisementsStore)

const advertisementFormInitialState = {
  ideaMarketId: props.ideaMarket.id,
  text: '',
  sender: user.value ? user.value : {},
  checkedBy: user.value ? [user.value.email] : [],
} as IdeaMarketAdvertisement

const advertisementDropdownActions: Action<IdeaMarketAdvertisement>[] = [
  {
    label: 'Удалить',
    className: 'text-danger',
    statement: checkAdvertisementsOwned(),
    click: handleDeleteAdvertisement,
  },
]

async function handleSendAdvertisement(values: IdeaMarketAdvertisement) {
  const currentUser = user.value

  if (currentUser?.token && props.ideaMarket) {
    const { token } = currentUser
    await ideaMarketAdvertisementsStore.postIdeaMarketAdvertisement(values, token)

    props.ideaMarketModalRef?.scrollTo({
      top: props.ideaMarketModalRef.scrollHeight,
      behavior: 'smooth',
    })
  }
}

async function handleDeleteAdvertisement(advertisement?: IdeaMarketAdvertisement) {
  const currentUser = user.value

  if (currentUser?.token && advertisement) {
    const { token } = currentUser
    const { id } = advertisement
    await ideaMarketAdvertisementsStore.deleteIdeaMarketAdvertisement(id, token)
  }
}

const handleCheckAdvertisement = async (
  ideaMarketAdvertisement: IdeaMarketAdvertisement,
) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token, email } = currentUser
    await ideaMarketAdvertisementsStore.checkIdeaMarketAdvertisement(
      ideaMarketAdvertisement,
      email,
      token,
    )
  }
}

const onIntersectionObserver = async (
  [{ isIntersecting }]: IntersectionObserverEntry[],
  ideaMarketAdvertisement: IdeaMarketAdvertisement,
) => {
  if (user.value) {
    const { email } = user.value

    const isCurrentUserCheckedAdvertisement =
      ideaMarketAdvertisement.checkedBy.includes(email)

    if (!isCurrentUserCheckedAdvertisement && isIntersecting) {
      await handleCheckAdvertisement(ideaMarketAdvertisement)
    }
  }
}

function getAdvertisementSender(advertisement: IdeaMarketAdvertisement) {
  const { sender } = advertisement

  return `${sender.firstName} ${sender.lastName}`
}

function checkIsActiveAdvertisement(advertisement: IdeaMarketAdvertisement) {
  const { checkedBy } = advertisement
  const currentUser = user.value

  return currentUser && checkedBy.includes(currentUser.email) ? false : true
}

function checkAdvertisementsOwned() {
  const { initiator, team } = props.ideaMarket

  return user.value?.id === initiator.id || team?.owner.userId === user.value?.id
}
</script>

<template>
  <AdvertisementsForm
    title="Объявления"
    input-placeholder="Добавить объявление"
    :initial-state="advertisementFormInitialState"
    :handle-send-advertisement="handleSendAdvertisement"
    :has-access-to-send="checkAdvertisementsOwned()"
  >
    <template #content>
      <template v-if="ideaMarketAdvertisements">
        <Advertisement
          v-for="advertisement in ideaMarketAdvertisements"
          :key="advertisement.id"
          :class-name="
            checkAdvertisementsOwned() ? 'current-user-advertisement' : 'mb-3'
          "
          :advertisement="advertisement"
          :text="advertisement.text"
          :sender="getAdvertisementSender(advertisement)"
          :created-at="advertisement.createdAt"
          :is-active="checkIsActiveAdvertisement(advertisement)"
          :has-access-to-actions="checkAdvertisementsOwned()"
          :dropdown-actions="advertisementDropdownActions"
          v-intersection-observer="
            (elem) => onIntersectionObserver(elem, advertisement)
          "
        />
      </template>

      <MarketAdvertisementsPlaceholder v-else />
    </template>
  </AdvertisementsForm>
</template>

<style lang="scss" scoped>
.current-user-advertisement {
  justify-self: end;
}
</style>
