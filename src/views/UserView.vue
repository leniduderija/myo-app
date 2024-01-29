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
          v-if="!edit"
          @click="toggleEdit"
          style="font-size: 24px; background: transparent"
          ><edit-outlined
        /></a>
      </template>

      <a-card title="Profile" class="profile">
        <a-form
          name="user-edit-form"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :disabled="submitting || !edit"
        >
          <a-form-item label="Username" v-bind="edit && validateInfos.username">
            <a-input
              v-model:value="modelRef.username"
              :bordered="edit"
              :disabled="!edit"
              style="color: #000"
            />
          </a-form-item>
          <a-form-item label="First name" v-bind="edit && validateInfos.firstName">
            <a-input
              v-model:value="modelRef.profile.firstName"
              :bordered="edit"
              :disabled="!edit"
            />
          </a-form-item>
          <a-form-item label="Last name" v-bind="edit && validateInfos.lastName">
            <a-input v-model:value="modelRef.profile.lastName" :bordered="edit" :disabled="!edit" />
          </a-form-item>
          <a-form-item label="Avatar name" v-bind="edit && validateInfos.avatar">
            <a-input v-model:value="modelRef.profile.avatar" :bordered="edit" :disabled="!edit" />
          </a-form-item>
          <a-form-item v-if="edit" :wrapper-col="{ span: 24 }" style="text-align: right">
            <a-button type="default" @click.prevent="toggleEdit" style="margin-right: 10px"
              >Cancel</a-button
            >
            <a-button type="primary" @click.prevent="onSubmit" data-testid="update-button"
              >Save</a-button
            >
          </a-form-item>
        </a-form>
      </a-card>
    </a-card>
  </a-flex>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { AxiosResponse } from 'axios'
import type { NotificationInstance } from 'ant-design-vue/es/notification'
import { notification } from 'ant-design-vue'
import { EditOutlined } from '@ant-design/icons-vue'
import type { User } from '@/shared/type-defs'
import usersService from '@/common/services/users-service'
import { capitalize } from '@/common/utils'

import { Form } from 'ant-design-vue'

const useForm = Form.useForm

const labelCol = { span: 4 }
const wrapperCol = { span: 14 }

const route = useRoute()
const id = String(route.params.userId)

const user = ref<{ value: User } | null>(null)

const loading = ref<Boolean>(true)
const edit = ref<Boolean>(route.query?.edit)
const submitting = ref<Boolean>(false)

const modelRef = ref(user)
const rulesRef = reactive({
  username: [
    {
      required: true,
      message: 'Please input username'
    }
  ],
  firstName: [
    {
      required: true,
      message: 'Please input first name'
    }
  ],
  lastName: [
    {
      required: true,
      message: 'Please input last name'
    }
  ],
  avatar: [
    {
      required: true,
      message: 'Please input avatar URL'
    }
  ]
})
const { validate, validateInfos } = useForm(modelRef, rulesRef, {
  onValidate: (...args) => console.log(...args)
})

const notificationMessage = ref<string>('')
const openNotificationWithIcon = (type: keyof NotificationInstance) => {
  notification[type]({
    message: capitalize(type),
    description: notificationMessage.value
  })
}

const toggleEdit = () => {
  edit.value = !edit.value
}

const onSubmit = () => {
  submitting.value = true
  validate()
    .then(() => saveUser())
    .catch((err) => {
      notificationMessage.value = 'Failed to edit user'
      openNotificationWithIcon('error')
      submitting.value = false
      console.error('Error: ', err)
    })
}

const saveUser = () => {
  usersService
    .updateUser(modelRef.value!)
    .then(() => {
      edit.value = !edit.value
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
