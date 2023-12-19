<script setup lang="ts" generic="VariableType">
import {
  ActionsListProps,
  ActionClickFunction,
  ActionStatement,
} from '@Components/ActionsList/ActionsList.types'

const props = defineProps<ActionsListProps<VariableType>>()

function checkActionStatement(statement?: ActionStatement<VariableType>) {
  const { outsideVariable } = props

  if (statement !== undefined) {
    if (typeof statement !== 'boolean' && outsideVariable) {
      return statement(outsideVariable)
    }

    return statement
  }

  return true
}

function getActionClassName(className?: string) {
  const actionButtonClass = [
    'list-group-item',
    'list-group-item-action',
    'cursor-pointer',
    'px-2',
    'py-1',
  ]

  if (className) {
    actionButtonClass.push(className)
  }

  return actionButtonClass
}

function actionClick(click: ActionClickFunction<VariableType>) {
  const { outsideVariable } = props

  if (outsideVariable) {
    return click(outsideVariable)
  }

  return click()
}
</script>

<template>
  <ul class="list-group list-group-flush">
    <template
      v-for="(action, index) in actions"
      :key="index"
    >
      <li
        v-if="checkActionStatement(action.statement)"
        :class="getActionClassName(action.className)"
        @click="actionClick(action.click)"
      >
        {{ action.label }}
      </li>
    </template>
  </ul>
</template>
