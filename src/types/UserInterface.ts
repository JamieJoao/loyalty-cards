import { User } from 'firebase/auth'

export interface UserState {
  user: User | null,
  addUser: (user: User | null) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  token: string | null
  setToken: (token: string | null) => void
}