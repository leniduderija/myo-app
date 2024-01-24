<script lang="ts" setup>
import { Form } from 'ant-design-vue'
import { reactive } from 'vue'

const useForm = Form.useForm

const labelCol = { span: 4 }
const wrapperCol = { span: 14 }

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

const { validate, validateInfos } = useForm(
  {
    username: '',
    profile: {
      firstName: '',
      lastName: '',
      avatar: ''
    }
  },
  rulesRef,
  {
    onValidate: (...args) => console.log(...args)
  }
)

defineProps<{
  disabled: boolean
  edit: boolean
  modelRef: {
    username: string
    profile: {
      firstName: string
      lastName: string
      avatar: string
    }
  }
  toggleEdit: () => void
  onSubmit: () => void
}>()
</script>

<template>
  <a-form
    name="user-edit-form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :disabled="disabled"
  >
    <a-form-item label="Username" v-bind="validateInfos.username">
      <a-input
        v-model:value="modelRef.username"
        :bordered="edit"
        :disabled="!edit"
        style="color: #000"
      />
    </a-form-item>
    <a-form-item label="First name" v-bind="edit && validateInfos.firstName">
      <a-input v-model:value="modelRef.profile.firstName" :bordered="edit" :disabled="!edit" />
    </a-form-item>
    <a-form-item label="Last name" v-bind="edit && validateInfos.lastName">
      <a-input v-model:value="modelRef.profile.lastName" :bordered="edit" :disabled="!edit" />
    </a-form-item>
    <a-form-item label="Avatar name" v-bind="edit && validateInfos.avatar">
      <a-input v-model:value="modelRef.profile.avatar" :bordered="edit" :disabled="!edit" />
    </a-form-item>
    <a-form-item v-if="edit" :wrapper-col="{ span: 16, offset: 8 }" style="text-align: right">
      <a-button type="default" @click.prevent="toggleEdit" style="margin-right: 10px"
        >Cancel</a-button
      >
      <a-button type="primary" @click.prevent="onSubmit">Save</a-button>
    </a-form-item>
  </a-form>
</template>

<style scoped></style>
