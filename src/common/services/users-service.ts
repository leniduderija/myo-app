import httpClient from '@/common/http/http-client'
import type { User } from '@/shared/type-defs'

const getUsers = async () => {
  return await httpClient.get<{ value: User[] }>(`/api/users`)
}

const getUser = async (userId: string) => {
  return await httpClient.get<{ data: User }>(`/api/users/${userId}`)
}

const updateUser = async (userId: string) => {
  return await httpClient.put<{ data: User }>(`/api/users/${userId}`)
}

const deleteUser = async (userId: string) => {
  return await httpClient.delete<{ data: User }>(`/api/users/${userId}`)
}

const createUser = async () => {
  return await httpClient.post<{ data: User }>(`/api/users`)
}

const usersService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}

export default usersService
