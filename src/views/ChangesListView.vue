<script lang="ts" setup>
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import ChangesElement from '@Components/ChangesElement/ChangesElement.vue'
import Typography from '@Components/Typography/Typography.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import Button from '@Components/Button/Button.vue'

const dateChanges = new Date(1991, 11, 17)
console.log(dateChanges)

function formatDate(date: Date) {
  if (date) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(date).toLocaleDateString('ru-RU', options)
  }
}
</script>

<template>
  <PageLayout content-class-name="change-list-page__content">
    <template #leftSideBar>
      <LeftSideBar />
    </template>
    <template #content>
      <FormLayout class-name="container-form">
        <div class="main">
          <div class="header">
            <Typography class-name=" fs-1 text-primary"
              >Журнал изменений</Typography
            >
          </div>
          <div class="changes-list">
            <ChangesElement
              :date="formatDate(dateChanges)"
              text="green"
              type="system"
              >Вы зарегистрировались</ChangesElement
            >
            <ChangesElement
              :date="formatDate(new Date(2001, 11, 15))"
              text="red"
              type="ideas"
              >Вашу идею удалили</ChangesElement
            >
            <ChangesElement
              :date="formatDate(new Date(1945, 1, 15))"
              type="personal"
              >Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
              repudiandae aliquam ullam perspiciatis cumque. Quas, sequi ut vel
              reprehenderit incidunt animi molestias, eaque officiis accusamus
              quis aut voluptas unde. Quo.</ChangesElement
            >
            <ChangesElement
              :date="formatDate(new Date(1945, 1, 15))"
              type="personal"
              >Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
              quo illo itaque praesentium. Voluptatem illo a voluptate. Quod
              consectetur, ad blanditiis maxime dolorem nulla, quidem quaerat
              omnis adipisci quos est.</ChangesElement
            >
            <ChangesElement
              :date="formatDate(new Date(1945, 1, 15))"
              type="personal"
              >Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Doloremque maxime perspiciatis magni rem magnam corrupti non
              expedita ipsam eaque. Cum voluptatem tempore doloremque, ullam
              asperiores voluptatibus vero voluptatum inventore
              facilis.</ChangesElement
            >
            <ChangesElement
              :date="formatDate(new Date(1945, 1, 15))"
              type="personal"
              >Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Doloremque maxime perspiciatis magni rem magnam corrupti non
              expedita ipsam eaque. Cum voluptatem tempore doloremque, ullam
              asperiores voluptatibus vero voluptatum inventore
              facilis.</ChangesElement
            >
          </div>
        </div>
        <div class="select shadow rounded">
          <div class="select-header bg-primary fs-3 text-light p-3 px-5">
            Выбрать только
          </div>
          <div class="container-checkbox">
            <Checkbox
              name="system"
              value="system"
              label="Система"
              class="checkbox-element"
            />
            <Checkbox
              name="personal"
              value="personal"
              label="Персональные"
              class="checkbox-element"
            />
            <Checkbox
              name="ideas"
              value="ideas"
              label="Идеи"
              class="checkbox-element"
            />
            <Button class-name="btn-primary w-100">Отсортировать</Button>
          </div>
        </div>
      </FormLayout>
    </template>
  </PageLayout>
</template>

<style lang="scss" scoped>
.change-list-page__content {
  &__content {
    @include flexible(center, center, column, $gap: 16px);
  }
}

.container-form {
  display: flex;
  width: 95%;
  height: 90%;
  @include flexible(flex-start, center);
  justify-content: space-between;
  justify-self: center;
  margin-left: 34px;
  margin-top: 16px;
  overflow: hidden;
}

// .select {
//   width: 400px;
// }

.header {
  margin-left: 16px;
  margin-top: 8px;
}

.main {
  height: 100%;
  display: grid;
  align-items: center;
}

.select-header {
  border-radius: 8px 8px 0 0;
  width: 400px;
  text-align: center;
}

.container-checkbox {
  padding: 16px;
  width: 100%;
}

.checkbox-element {
  margin: 16px;
  font-size: 24px;
  margin-left: 24px;
}

.changes-list {
  width: 100%;
  box-sizing: border-box;
  height: 90%;
  max-height: min-content;
  overflow-y: scroll;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(209, 209, 209);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb {
  background-color: #0d6efd;
  border-radius: 20px;
  border: 3px solid #0d6efd;
}
</style>
