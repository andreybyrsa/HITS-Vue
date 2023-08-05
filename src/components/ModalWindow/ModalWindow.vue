<template>
  <div>
    <!-- Кнопка, открывающая модальное окно -->
    <Button
      @click="openModal"
      v-if="user.roles.length >= 2"
    >
      <Typography>Выбрать роль</Typography>
    </Button>

    <!-- Модальное окно -->
    <transition name="modal">
      <div
        class="modal"
        v-if="showModal"
      >
        <!-- Кнопка закрытия модального окна -->
        <Button
          class="close-button"
          @click="closeModal"
        >
          <Typography>Закрыть</Typography>
        </Button>

        <!-- Вывод данных в виде кнопок -->
        <Button
          v-for="role in user.roles"
          :key="role.id"
        >
          <Typography>{{ role.name }}</Typography>
        </Button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { createApp, ref } from 'vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'

interface User {
  roles: Array<string>
}

const app = createApp({
  components: {
    Button,
    Typography,
  },
  setup() {
    const userStore = useUserStore()
    const user = ref<User | null>(null)

    const showModal = ref(false)

    const openModal = () => {
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
    }

    user.value = userStore.user

    return {
      user,
      showModal,
      openModal,
      closeModal,
    }
  },
})
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
