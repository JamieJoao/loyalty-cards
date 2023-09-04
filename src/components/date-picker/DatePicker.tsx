import { FC, useRef, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const days = new Array(31).fill(0).map((_, i) => ({ label: i + 1, key: i + 1 }))
const months = [
  { label: 'Enero', key: 1 },
  { label: 'Febrero', key: 2 },
  { label: 'Marzo', key: 3 },
  { label: 'Abril', key: 4 },
  { label: 'Mayo', key: 5 },
  { label: 'Junio', key: 6 },
  { label: 'Julio', key: 7 },
  { label: 'Agosto', key: 8 },
  { label: 'Setiembre', key: 9 },
  { label: 'Octubre', key: 10 },
  { label: 'Noviembre', key: 11 },
  { label: 'Diciembre', key: 12 },
]
const years = new Array(10).fill(0).map((_, i) => ({ label: i + 1990, key: i + 1990 }))

export const BirthDayPicker: FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date())

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)} />
  )
}