import { dayjs } from 'element-plus'

export const formatDate = (date) => dayjs(date).format('YYYY年MM月DD日')
