<template>
  <a-flex justify="flex-start" class="user">
    <a-card :loading="loading" class="user-card">
      <template #title
        ><a-card-meta
          data-testid="user-card-title"
          :title="user?.username"
          :description="'Created on ' + new Date(user?.createdAt).toLocaleDateString()"
          class="card-title"
        >
          <template #avatar>
            <a-avatar :src="user?.profile.avatar" />
          </template> </a-card-meta
      ></template>

      <template #extra>
        <a
          data-testid="enable-update"
          v-if="!editing"
          @click="toggleEditing"
          style="font-size: 24px; background: transparent"
          ><edit-outlined
        /></a>
      </template>

      <a-card title="Profile" class="profile">
        <UserForm
          :form-values="modelRef"
          :submitting="submitting"
          :form-type="'edit'"
          :editing="editing"
          :on-submit="onSubmit"
          :on-reject="onReject"
          :on-cancel="toggleEditing"
        />
      </a-card>
    </a-card>
  </a-flex>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { AxiosResponse } from 'axios'
import type { NotificationInstance } from 'ant-design-vue/es/notification'
import { notification } from 'ant-design-vue'
import { EditOutlined } from '@ant-design/icons-vue'
import type { User } from '@/shared/type-defs'
import usersService from '@/common/services/users-service'
import { capitalize } from '@/common/utils'
import UserForm from '@/components/form/UserForm.vue'
import { RejectNotification } from '@/shared/type-defs'

const route = useRoute()
const id = String(route.params.userId)

const user = ref<{ value: User } | null>(null)

const loading = ref<Boolean>(true)
const editing = ref<Boolean>(route.query?.edit)
const submitting = ref<Boolean>(false)

const modelRef = ref(user)

const notificationMessage = ref<string>('')
const openNotificationWithIcon = (type: keyof NotificationInstance) => {
  notification[type]({
    message: capitalize(type),
    description: notificationMessage.value
  })
}

const toggleEditing = () => {
  editing.value = !editing.value
}

const onSubmit = (values: User) => {
  saveUser(values)
}

const onReject = (notification: RejectNotification) => {
  notificationMessage.value = notification.message
  openNotificationWithIcon(notification.type)
}

const saveUser = (values: User) => {
  usersService
    .updateUser(values)
    .then(() => {
      editing.value = !editing.value
      submitting.value = false
      notificationMessage.value = 'Successfully edited user'
      openNotificationWithIcon('success')
    })
    .catch((err: AxiosResponse) => {
      notificationMessage.value = 'Failed to fetch users'
      openNotificationWithIcon('error')
      submitting.value = false
      console.error('Error: ', err)
    })
}

const onFetchUserById = async () => {
  await usersService
    .getUser(id)
    .then((response: AxiosResponse<{ value: User }>) => {
      user.value = response.data
      loading.value = false
    })
    .catch((err: AxiosResponse) => {
      notificationMessage.value = 'Failed to fetch user'
      openNotificationWithIcon('error')
      console.error('Error: ', err)
    })
}
onFetchUserById()
</script>

<style>
.card-title {
  padding: 10px 0;
}

.user-card {
  width: 100%;
}

.user {
  width: 100%;
}

@media (min-width: 1024px) {
  .user {
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    width: 100%;
    margin: 20px 0;
  }
}
</style>
