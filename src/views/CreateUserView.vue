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
        <!--    TODO Leni 29/01: Move form to separate component which can be reused for user details page as well    -->
        <a-form
          name="user-create-form"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :disabled="submitting"
        >
          <FormInput
            name="username"
            label="Username"
            placeholder="Enter username"
            type="text"
            v-model="modelRef.username"
            :validateInfo="validateInfos.username"
          />
          <FormInput
            name="profile.firstName"
            label="First Name"
            placeholder="Enter first name"
            type="text"
            v-model="modelRef.profile.firstName"
            :validateInfo="validateInfos.firstName"
          />
          <FormInput
            name="profile.lastName"
            label="Last Name"
            placeholder="Enter last name"
            type="text"
            v-model="modelRef.profile.lastName"
            :validateInfo="validateInfos.lastName"
          />
          <FormInput
            name="profile.avatar"
            label="Avatar"
            placeholder="Enter avatar URL"
            type="text"
            v-model="modelRef.profile.avatar"
            :validateInfo="validateInfos.avatar"
          />
          <a-form-item :wrapper-col="{ span: 24 }" style="text-align: right">
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
import FormInput from '@/components/form/FormInput.vue'

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
