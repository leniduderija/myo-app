<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { RejectNotification, User } from '@/shared/type-defs'
import { Form } from 'ant-design-vue'
import FormInput from '@/components/form/FormInput.vue'

type FormType = 'new' | 'edit'
export interface Props {
  submitting: boolean
  editing?: boolean
  formType?: FormType
  formValues: User | Omit<User, 'id' | 'createdAt'>
  onSubmit: (values: Omit<User, 'id' | 'createdAt'>) => void
  onReject: (notification: RejectNotification) => void
  onCancel?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  editing: false,
  formType: 'new'
})

const useForm = Form.useForm

const labelCol = { span: 4 }
const wrapperCol = { span: 14 }

const validating = ref<Boolean>(false)

const rulesRef = reactive({
  username: [
    {
      required: true,
      message: 'Please input username'
    }
  ],
  'profile.firstName': [
    {
      required: true,
      message: 'Please input first name'
    }
  ],
  'profile.lastName': [
    {
      required: true,
      message: 'Please input last name'
    }
  ],
  'profile.avatar': [
    {
      required: true,
      message: 'Please input avatar URL'
    }
  ]
})
const { validate, validateInfos, resetFields } = useForm(props.formValues, rulesRef, {
  onValidate: (...args) => console.log(...args)
})

const handleSubmit = () => {
  validating.value = true
  validate()
    .then(() => {
      validating.value = false
      console.log('')
      props.onSubmit(props.formValues)
    })
    .catch((err) => {
      const message = props.formType === 'edit' ? 'Failed to edit user' : 'Failed to create user'
      const type = 'error'
      props.onReject({
        type,
        message
      })
      console.error('Error: ', err)
      validating.value = false
    })
}

const handleCancel = () => {
  resetFields()
  props.onCancel()
}
</script>

<template>
  <a-form
    name="user-create-form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :disabled="submitting || validating || (formType === 'edit' && !editing)"
  >
    <FormInput
      name="username"
      label="Username"
      placeholder="Enter username"
      type="text"
      v-model="(formValues as User).username"
      :validateInfo="validateInfos.username"
      :disabled="formType === 'edit' && !editing"
    />
    <FormInput
      name="profile.firstName"
      label="First Name"
      placeholder="Enter first name"
      type="text"
      v-model="(formValues as User).profile.firstName"
      :validateInfo="validateInfos['profile.firstName']"
      :disabled="formType === 'edit' && !editing"
    />
    <FormInput
      name="profile.lastName"
      label="Last Name"
      placeholder="Enter last name"
      type="text"
      v-model="(formValues as User).profile.lastName"
      :validateInfo="validateInfos['profile.lastName']"
      :disabled="formType === 'edit' && !editing"
    />
    <FormInput
      name="profile.avatar"
      label="Avatar"
      placeholder="Enter avatar URL"
      type="text"
      v-model="(formValues as User).profile.avatar"
      :validateInfo="validateInfos['profile.avatar']"
      :disabled="formType === 'edit' && !editing"
    />
    <a-form-item
      v-if="(formType === 'edit' && editing) || formType === 'new'"
      :wrapper-col="{ span: 24 }"
      style="text-align: right"
    >
      <a-button type="default" @click.prevent="handleCancel" style="margin-right: 10px"
        >Cancel</a-button
      >
      <a-button type="primary" @click.prevent="handleSubmit">Save</a-button>
    </a-form-item>
  </a-form>
</template>

<style scoped></style>
