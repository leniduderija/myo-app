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
        <a-form
          name="user-create-form"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :disabled="submitting"
        >
          <a-form-item label="Username" v-bind="validateInfos.username">
            <a-input v-model:value="modelRef.username" />
          </a-form-item>
          <a-form-item label="First name" v-bind="validateInfos.firstName">
            <a-input v-model:value="modelRef.profile.firstName" />
          </a-form-item>
          <a-form-item label="Last name" v-bind="validateInfos.lastName">
            <a-input v-model:value="modelRef.profile.lastName" />
          </a-form-item>
          <a-form-item label="Avatar name" v-bind="validateInfos.avatar">
            <a-input v-model:value="modelRef.profile.avatar" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 16, offset: 8 }" style="text-align: right">
            <a-button type="primary" @click.prevent="onSubmit">Save</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-card>
  </a-flex>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { AxiosResponse } from 'axios'
import type { NotificationInstance } from 'ant-design-vue/es/notification'
import { notification } from 'ant-design-vue'
import usersService from '@/common/services/users-service'
import { capitalize } from '@/common/utils'

import { Form } from 'ant-design-vue'
import router from '@/router'

const useForm = Form.useForm

const emptyFormValues = {
  username: '',
  profile: {
    avatar: '',
    firstName: '',
    lastName: ''
  }
}

const labelCol = { span: 4 }
const wrapperCol = { span: 14 }

const modelRef = reactive(emptyFormValues)
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
const onSubmit = () => {
  submitting.value = true
  validate()
    .then(() => createUser())
    .catch((err) => {
      notificationMessage.value = 'Failed to create user'
      openNotificationWithIcon('error')
      console.error('Error: ', err)
      submitting.value = false
    })
}

const submitting = ref<Boolean>(false)

const notificationMessage = ref<string>('')
const openNotificationWithIcon = (type: keyof NotificationInstance) => {
  notification[type]({
    message: capitalize(type),
    description: notificationMessage.value
  })
}

const createUser = () => {
  usersService
    .createUser(modelRef)
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
