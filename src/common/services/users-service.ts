import httpClient from '@/common/http/http-client'
import type { User } from '@/shared/type-defs'

const getUsers = async () => {
  return await httpClient.get<{ value: User[] }>(`/api/users`)
}

const getUser = async (userId: string) => {
  return await httpClient.get<{ value: User }>(`/api/users/${userId}`)
}

const updateUser = async (values: User) => {
  return await httpClient.put<{ value: User }>(`/api/users/${values.id}`, values)
}

const deleteUser = async (userId: string) => {
  return await httpClient.delete<{ value: User }>(`/api/users/${userId}`)
}

const createUser = async (values: Omit<User, 'createdAt' | 'id'>) => {
  return await httpClient.post<User>(`/api/users`, values)
}

const usersService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}

export default usersService
