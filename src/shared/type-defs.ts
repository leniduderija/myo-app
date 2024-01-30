import { NotificationInstance } from 'ant-design-vue/es/notification'

export interface Profile {
  avatar: string
  firstName: string
  lastName: string
}

export interface User {
  id: string
  username: string
  profile: Profile
  createdAt: Date
}

export type RejectNotification = {
  type: keyof NotificationInstance
  message: string
}
