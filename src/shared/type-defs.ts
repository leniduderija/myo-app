export interface Profile {
  avatar: string
  firstName: string
  lastName: string
}

export interface User {
  id: string
  username: string
  profile: Profile
  createdAt: Date
}
