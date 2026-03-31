import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/uz'

dayjs.extend(relativeTime)
dayjs.locale('uz')

export const formatDate   = (date) => dayjs(date).format('DD.MM.YYYY')
export const formatRelative = (date) => dayjs(date).fromNow()
export const formatFull   = (date) => dayjs(date).format('DD MMMM YYYY, HH:mm')
