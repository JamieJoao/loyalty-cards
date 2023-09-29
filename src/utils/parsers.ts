import moment from "moment"

export const parseDateForInput = (date: Date) => {
  return moment(date).format('YYYY-MM-DD')
}