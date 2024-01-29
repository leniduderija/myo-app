import httpClient from '@/common/http/http-client'
import type { User } from '@/shared/type-defs'

const getUsers = async () => {
  return await httpClient.get<{ value: User[] }>(`/api/users`)
}

const getUser = (userId: string) => {
  return httpClient.get<{ value: User }>(`/api/users/${userId}`)
}

const updateUser = (values: User) => {
  return httpClient.put<{ value: User }>(`/api/users/${values.id}`, values)
}

const deleteUser = (userId: string) => {
  return httpClient.delete<{ value: User }>(`/api/users/${userId}`)
}

const createUser = (values: Omit<User, 'createdAt' | 'id'>) => {
  return httpClient.post<User>(`/api/users`, values)
}

const usersService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}

export default usersService
