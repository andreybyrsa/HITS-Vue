<script setup lang="ts" generic="OptionType">
import { Ref, ref, computed, watch, VueElement } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useField } from 'vee-validate'

import {
  ComboboxProps,
  SearchedOptionType,
} from '@Components/Inputs/Combobox/Combobox.types'
import Input from '@Components/Inputs/Input/Input.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Radio from '@Components/Inputs/Radio/Radio.vue'

import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

defineModel<OptionType | OptionType[]>({
  required: false,
})

const props = defineProps<ComboboxProps<OptionType>>()
const options = ref(props.options) as Ref<OptionType[]>

const searchedValue = ref('')

const choicesRef = ref<VueElement | null>(null)
const isOpenedChoices = ref(false)

const { value: selectedValue, errorMessage } = useField<OptionType | OptionType[]>(
  () => props.name,
  undefined,
  {
    syncVModel: true,
  },
)

watch(
  () => props.options,
  (currentOptions) => (options.value = currentOptions),
)

function isMultiselect(
  selectedValue: OptionType | OptionType[],
): selectedValue is OptionType[] {
  return selectedValue instanceof Array
}

function getCurrentOption(option: OptionType) {
  if (props.displayBy) {
    const label = props.displayBy.reduce(
      (prevValue, key) => (prevValue += `${option[key]} `),
      '',
    )

    return { label, option }
  }

  return { label: `${option}`, option }
}

const searchedOptions = computed(() => {
  const currentSearchedValue = searchedValue.value.trim().toLocaleLowerCase()

  return options.value.reduce<SearchedOptionType<OptionType>[]>(
    (optionsArray, option) => {
      const currentOption = getCurrentOption(option)

      const isIncludesSeachedValue = currentOption.label
        .trim()
        .toLocaleLowerCase()
        .includes(currentSearchedValue)

      if (isIncludesSeachedValue) {
        optionsArray.push(currentOption)
      }

      return optionsArray
    },
    [],
  )
})

function selectOption(currentOption: OptionType) {
  if (isMultiselect(selectedValue.value)) {
    const selectedOptionIndex = selectedValue.value.findIndex(
      (option) => option === currentOption,
    )

    if (selectedOptionIndex !== -1) {
      return selectedValue.value.splice(selectedOptionIndex, 1)
    }
    return selectedValue.value.push(currentOption)
  }

  selectedValue.value = currentOption
}

function getComboboxPlaceholder() {
  if (isMultiselect(selectedValue.value)) {
    const selectedValueLength = selectedValue.value.length
    return selectedValueLength > 0
      ? `Выбрано ${selectedValueLength}`
      : props.placeholder
  }

  return selectedValue.value
    ? getCurrentOption(selectedValue.value).label
    : props.placeholder
}

function focusCombobox() {
  isOpenedChoices.value = true
}

onClickOutside(choicesRef, (event) => {
  const elementeClassName = (event as PointerEvent & HTMLTargetEvent).target
    .className
  if (!elementeClassName.includes('combobox__search')) {
    isOpenedChoices.value = false
    searchedValue.value = ''
  }
})
</script>

<template>
  <div class="w-100">
    <label
      v-if="props.label"
      class="form-label mb-2 text-primary"
    >
      {{ props.label }}
    </label>

    <div class="combobox">
      <Input
        :name="`search-${props.label}`"
        class-name="combobox__search rounded-end"
        v-model="searchedValue"
        :error="errorMessage"
        :placeholder="getComboboxPlaceholder()"
        @focus="focusCombobox"
      />

      <div
        v-if="isOpenedChoices"
        ref="choicesRef"
        class="combobox__choices list-group w-100"
      >
        <div
          v-for="{ label, option } in searchedOptions"
          :key="label"
          class="combobox__choice list-group-item list-group-item-action"
          @click="selectOption(option)"
        >
          <Checkbox
            v-if="isMultiselect(selectedValue)"
            :name="`checkbox-${label}`"
            :label="label"
            :value="option"
            v-model="selectedValue"
          />
          <Radio
            v-else
            :name="`radio-${label}`"
            :label="label"
            :value="option"
            v-model="selectedValue"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.combobox {
  position: relative;

  &__placeholder {
    @include position(absolute, 0, 0, 0, 12px);

    border-radius: 6px;

    @include flexible(center, flex-start);
  }

  &__choices {
    @include position(absolute, $top: 42px, $z-index: 5);

    max-height: 173px;

    overflow-y: scroll;
  }

  &__choice {
    padding: 8px 12px;

    cursor: pointer;

    @include flexible(center, flex-start);
  }
}
</style>
