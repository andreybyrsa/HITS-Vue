import { VueElement } from 'vue'
import { FieldEntry } from 'vee-validate'

interface FormInputsProps {
  fileds: FieldEntry<string>[]
  submitCount: number
}

interface FormControllersProps {
  fileInputRef: VueElement | null
  rolesError?: string
}

interface FormInputsEmits {
  (event: 'push-email', email: string): void
  (event: 'move-email', prevIndex: number, currentIndex: number): void
  (event: 'remove-email', index: number): void
}

interface FormControllersEmits {
  (event: 'push-email', email: string): void
}

export {
  FormInputsProps,
  FormControllersProps,
  FormInputsEmits,
  FormControllersEmits,
}
