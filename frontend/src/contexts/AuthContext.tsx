import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import api from '../services/api'

export type ParticipationRole = 'Jogador' | 'Goleiro'

export type User = {
  id: number
  name: string
  email: string
  is_active: boolean
  is_admin: boolean
  preferred_role: ParticipationRole
}

type LoginData = {
  email: string
  password: string
}

type AuthContextData = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextData | undefined>(
  undefined
)

const TOKEN_KEY = 'racha-facil-token'

export const AuthProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarUsuario = async () => {
      const token = localStorage.getItem(TOKEN_KEY)

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get<User>('/users/me')

        setUser(response.data)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    carregarUsuario()
  }, [])

  const login = async ({
    email,
    password,
  }: LoginData) => {
    const response = await api.post<{
      access_token: string
      token_type: string
    }>('/auth/login', {
      email,
      password,
    })

    localStorage.setItem(
      TOKEN_KEY,
      response.data.access_token
    )

    const userResponse = await api.get<User>('/users/me')

    setUser(userResponse.data)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  const updateUser = (user: User) => {
    setUser(user)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth deve ser usado dentro de AuthProvider'
    )
  }

  return context
}