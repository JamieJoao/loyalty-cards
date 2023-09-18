import { InputLabelTypes, InputTypes } from "./types/CustomerInterface";

export const inputTypes: { [key: string]: InputTypes | InputLabelTypes }[] = [
  { key: 'text', label: 'Texto' },
  { key: 'select', label: 'Opciones' },
  { key: 'number', label: 'Número' },
  { key: 'date', label: 'Fecha' },
  { key: 'textarea', label: 'Texto Grande' },
]