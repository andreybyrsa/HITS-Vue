<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Typography from '@Components/Typography/Typography.vue'
</script>

<template>
  <div
    class="d-flex mt-2 w-100 h-100 flex-column gap-3 overflow-scroll sprint-list-page"
  >
    <Button
      variant="outline-dark"
      class-name=" w-100 p-5"
    >
      Диаграмма сгорания
    </Button>

    <ul class="list-group rounded-3 w-100">
      <li class="list-group-item p-0 overflow-hidden w-100">
        <Button
          variant="light"
          class-name="collapse-controller w-100"
          v-collapse:openOnMount="321"
        >
          Цель
        </Button>
        <Collapse id="321">
          <div class="p-2">
            {{
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!'
            }}
          </div>
        </Collapse>
      </li>
    </ul>

    <ul class="list-group rounded-3 w-100">
      <li class="list-group-item p-0 overflow-hidden w-100">
        <Button
          variant="light"
          class-name="collapse-controller w-100"
          v-collapse="333"
        >
          Отчет
        </Button>
        <!-- Сделать чтобы колапс не выходил за рамки при обширном тексте -->
        <Collapse id="333">
          <div class="p-2">
            {{
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat! '
            }}
          </div>
        </Collapse>
      </li>
    </ul>

    <ul class="list-group rounded-3 w-100">
      <li class="list-group-item p-0 overflow-hidden w-100">
        <Button
          variant="light"
          class-name="collapse-controller w-100"
          v-collapse="125"
        >
          Оценки участников
        </Button>
        <Collapse id="125">
          <div class="p-2">
            {{
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!'
            }}
          </div>
        </Collapse>
      </li>
    </ul>
    <div>
      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Начало спринта:' }} </Typography>
        <Typography> {{ '13.03.2024' }} </Typography>
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Конец спринта:' }} </Typography>
        <Typography> {{ '25.03.2024' }} </Typography>
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Выполнено задач:' }} </Typography>
        <Typography> {{ '10' }} </Typography>
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Потрачено часов:' }} </Typography>
        <Typography> {{ '24' }} </Typography>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}

.sprint-list-page {
  @include flexible(flex-start);
  height: 85%;
  max-height: 85%;
}
</style>
