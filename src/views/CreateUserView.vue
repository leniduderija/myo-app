<template>
  <a-flex justify="flex-start" class="new-user">
    <a-card class="create-user-card">
      <template #title
        ><a-card-meta :title="modelRef.username ?? 'Create new user'" class="card-title">
          <template #avatar>
            <a-avatar v-if="modelRef.profile.avatar" :src="modelRef.profile.avatar" />
          </template> </a-card-meta
      ></template>

      <a-card title="Profile" class="profile">
        <UserForm
          :form-values="modelRef"
          :submitting="submitting"
          :on-submit="onSubmit"
          :on-reject="onReject"
        />
      </a-card>
    </a-card>
  </a-flex>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { AxiosResponse } from 'axios'
import router from '@/router'
import type { NotificationInstance } from 'ant-design-vue/es/notification'
import { notification } from 'ant-design-vue'
import usersService from '@/common/services/users-service'
import { capitalize } from '@/common/utils'
import { RejectNotification, User } from '@/shared/type-defs'
import UserForm from '@/components/form/UserForm.vue'

const emptyFormValues = {
  username: '',
  profile: {
    avatar: '',
    firstName: '',
    lastName: ''
  }
}

const modelRef = reactive(emptyFormValues)

const submitting = ref<Boolean>(false)

const onSubmit = (values: Omit<User, 'id' | 'createdAt'>) => {
  createUser(values)
}
const onReject = (notification: RejectNotification) => {
  notificationMessage.value = notification.message
  openNotificationWithIcon(notification.type)
}

const notificationMessage = ref<string>('')
const openNotificationWithIcon = (type: keyof NotificationInstance) => {
  notification[type]({
    message: capitalize(type),
    description: notificationMessage.value
  })
}

const createUser = (values: Omit<User, 'id' | 'createdAt'>) => {
  usersService
    .createUser(values)
    .then((response) => {
      submitting.value = false
      notificationMessage.value = 'Successfully created user'
      openNotificationWithIcon('success')
      const user = response.data
      router.push(`/users/${user.id}`)
    })
    .catch((err: AxiosResponse) => {
      submitting.value = false
      notificationMessage.value = 'Failed to create user'
      openNotificationWithIcon('error')
      console.error('Error: ', err)
    })
}
</script>

<style>
.card-title {
  padding: 10px 0;
}

.create-user-card {
  width: 100%;
}
.new-user {
  width: 100%;
}

@media (min-width: 1024px) {
  .new-user {
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    width: 100%;
    margin: 20px 0;
  }
}
</style>
