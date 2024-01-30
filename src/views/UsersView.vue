<template>
  <br />
  <br />
  <a-table
    id="users-table"
    class="users-table"
    bordered
    size="large"
    :dataSource="users"
    :columns="columns"
    :loading="!users"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'username'">
        <a-avatar :src="record.profile.avatar" style="margin-right: 5px" />
        <router-link :to="'/users/' + record.id">{{ record.username }}</router-link>
      </template>
      <template v-if="column.key === 'firstName'">
        {{ record.profile.firstName }}
      </template>
      <template v-if="column.key === 'lastName'">
        {{ record.profile.lastName }}
      </template>
      <template v-if="column.key === 'createdAt'">
        {{ new Date(record.createdAt).toLocaleDateString() }}
      </template>
      <template v-if="column.key === 'action'">
        <span>
          <router-link :to="'/users/' + record.id + '?edit=true'">Edit</router-link>
          <a-divider type="vertical" />
          <a-popconfirm
            v-if="users.length"
            id="delete-confirmation"
            data-testid="delete-confirmation"
            :title="'Are you sure you want to delete ' + record.username + '?'"
            @confirm="onDelete(record.id)"
          >
            <a>Delete</a>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { AxiosResponse } from 'axios'
import type { User } from '@/shared/type-defs'
import { notification } from 'ant-design-vue'
import type { NotificationInstance } from 'ant-design-vue/es/notification'
import { capitalize } from '@/common/utils'
import usersService from '@/common/services/users-service'

const columns = [
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: 'First name',
    dataIndex: 'firstName',
    key: 'firstName'
  },
  {
    title: 'Last name',
    dataIndex: 'lastName',
    key: 'lastName'
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Action',
    key: 'action'
  }
]

const users = ref<{ value: User[] } | null>(null)

const notificationMessage = ref<string>('')

const openNotificationWithIcon = (type: keyof NotificationInstance) => {
  notification[type]({
    message: capitalize(type),
    description: notificationMessage.value
  })
}

const onFetchUsers = () => {
  usersService
    .getUsers()
    .then((response: AxiosResponse<{ value: User[] }>) => {
      users.value = response.data
    })
    .catch((err: AxiosResponse) => {
      notificationMessage.value = 'Failed to fetch users'
      openNotificationWithIcon('error')
      console.error('Error: ', err)
    })
}
const onDelete = (id: string) => {
  usersService
    .deleteUser(id)
    .then(() => {
      notificationMessage.value = 'Successfully deleted user'
      openNotificationWithIcon('success')
      onFetchUsers()
    })
    .catch((err) => {
      notificationMessage.value = 'Failed to delete user'
      openNotificationWithIcon('error')
      console.error('Error ', err)
    })
}

onMounted(() => {
  onFetchUsers()
})
</script>

<style>
.users-table {
  overflow-x: scroll;
  width: 100%;
  margin: 20px 0;
}
@media (min-width: 1024px) {
  .users {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
