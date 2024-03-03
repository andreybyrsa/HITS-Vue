import { VueElement } from 'vue'
import { FieldEntry } from 'vee-validate'

export interface FormInputsProps {
  fileds: FieldEntry<string>[]
  submitCount: number
}

export interface FormControllersProps {
  fileInputRef: VueElement | null
  rolesError?: string
}

export interface FormInputsEmits {
  (event: 'push-email', email: string): void
  (event: 'move-email', prevIndex: number, currentIndex: number): void
  (event: 'remove-email', index: number): void
}

export interface FormControllersEmits {
  (event: 'push-email', email: string): void
}

