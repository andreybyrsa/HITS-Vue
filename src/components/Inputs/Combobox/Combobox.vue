<script setup lang="ts" generic="OptionType">
import { Ref, ref, computed, watch, VueElement } from 'vue'
import { useField } from 'vee-validate'
import { onClickOutside } from '@vueuse/core'

import {
  ComboboxProps,
  ComboboxEmits,
  SearchedOptionType,
} from '@Components/Inputs/Combobox/Combobox.types'
import Input from '@Components/Inputs/Input/Input.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Radio from '@Components/Inputs/Radio/Radio.vue'
import Icon from '@Components/Icon/Icon.vue'

defineModel<OptionType | OptionType[]>({
  required: false,
})
const props = defineProps<ComboboxProps<OptionType>>()
const emit = defineEmits<ComboboxEmits<OptionType>>()
const options = ref(props.options) as Ref<OptionType[]>

const searchedValue = ref('')

const comboboxRef = ref<VueElement | null>(null)
const isOpenedChoices = ref(false)

const {
  value: selectedValue,
  meta,
  errorMessage,
} = useField<OptionType | OptionType[]>(props.name, undefined, {
  validateOnMount: false,
  validateOnValueUpdate: true,
  controlled: props.noFormControlled ? false : true,
  syncVModel: true,
})

function getFiledError() {
  if (meta.touched || meta.dirty) {
    if (isMultiselect(selectedValue.value)) {
      return selectedValue.value.length > 0 ? undefined : errorMessage.value
    }
    return selectedValue.value !== undefined ? undefined : errorMessage.value
  }
}

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
    const label = props.displayBy
      .reduce((prevValue, key) => (prevValue += `${option[key]} `), '')
      .slice(0, -1)

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
      (option) =>
        option === currentOption ||
        JSON.stringify(option) === JSON.stringify(currentOption),
    )

    if (selectedOptionIndex !== -1) {
      emit('onUnselect', currentOption)
      return selectedValue.value.splice(selectedOptionIndex, 1)
    }

    emit('onSelect', currentOption)
    return selectedValue.value.push(currentOption)
  }

  emit('onSelect', currentOption)
  selectedValue.value = currentOption
}

function getComboboxPlaceholder() {
  if (isMultiselect(selectedValue.value)) {
    const selectedValueLength = selectedValue.value.reduce(
      (selectedAmount, currentValue) => {
        const isExistInOptions = options.value.find(
          (option) =>
            option === currentValue ||
            JSON.stringify(option) === JSON.stringify(currentValue),
        )

        if (isExistInOptions) return (selectedAmount += 1)
        return selectedAmount
      },
      0,
    )

    if (selectedValueLength > 0) {
      return props.multiselectPlaceholder
        ? `${props.multiselectPlaceholder} (${selectedValueLength})`
        : `Выбрано ${selectedValueLength}`
    }
    return props.placeholder
  }

  return selectedValue.value
    ? getCurrentOption(selectedValue.value).label
    : props.placeholder
}

function focusCombobox() {
  isOpenedChoices.value = true
}

async function handleAddNewOption() {
  emit('addNewOption', searchedValue.value)
  searchedValue.value = ''
}

onClickOutside(comboboxRef, () => {
  isOpenedChoices.value = false
  searchedValue.value = ''
})

function checkNewOptionButton() {
  if (searchedValue.value.trim() === '') {
    return false
  }

  const isExistNewOption = props.options.find(
    (option) => getCurrentOption(option).label === searchedValue.value,
  )
  return !isExistNewOption && searchedValue.value.length && isOpenedChoices.value
}

function checkOpenComboboxButton() {
  return searchedOptions.value.length && !isOpenedChoices.value && !props.disabled
}
</script>

<template>
  <div
    class="w-100"
    ref="comboboxRef"
  >
    <label
      v-if="props.label"
      class="form-label mb-2 text-primary"
    >
      {{ props.label }}
    </label>

    <div class="combobox">
      <Input
        :name="`search-${props.name}`"
        class-name="combobox__search rounded-end"
        v-model="searchedValue"
        :error="getFiledError()"
        no-form-controlled
        :placeholder="getComboboxPlaceholder()"
        @focus="focusCombobox"
        :disabled="disabled"
      />

      <Icon
        v-if="checkOpenComboboxButton()"
        class-name="combobox__icon bi bi-chevron-down"
        @click="focusCombobox"
      />
      <Icon
        v-if="checkNewOptionButton()"
        class-name="combobox__icon bi bi-plus-lg"
        @click="handleAddNewOption"
      />

      <div
        v-if="isOpenedChoices"
        class="combobox__choices list-group w-100"
      >
        <div
          v-for="{ label, option } in searchedOptions"
          :key="label"
          class="combobox__choice d-flex list-group-item list-group-item-action"
          @click="selectOption(option)"
        >
          <Checkbox
            v-if="isMultiselect(selectedValue)"
            :name="`checkbox-${label}`"
            :label="label"
            :value="option"
            v-model="selectedValue"
            no-form-controlled
          />
          <Radio
            v-else
            :name="`radio-${label}`"
            :label="label"
            :value="option"
            v-model="selectedValue"
            no-form-cotrolled
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.combobox {
  position: relative;

  &__search::placeholder {
    color: $black-color !important;
  }

  &__icon {
    @include position(absolute, $top: 11px, $right: 12px, $z-index: 5);

    cursor: pointer;
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
