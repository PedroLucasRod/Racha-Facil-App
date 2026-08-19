import api from './api'

export type ParticipationRole = 'Jogador' | 'Goleiro'

export type UserProfile = {
  id: number
  name: string
  email: string
  is_active: boolean
  is_admin: boolean
  preferred_role: ParticipationRole
}

export type AtualizarPerfilData = {
  name: string
  email: string
  preferred_role: ParticipationRole
}

export type AtualizarPreferenciaData = {
  preferred_role: ParticipationRole
}

export const buscarMeuPerfil = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/users/me')

  return response.data
}

export const atualizarMeuPerfil = async (
  dados: AtualizarPerfilData
): Promise<UserProfile> => {
  const response = await api.patch<UserProfile>(
    '/users/me',
    dados
  )

  return response.data
}

export const atualizarPreferenciaParticipacao = async (
  dados: AtualizarPreferenciaData
): Promise<UserProfile> => {
  const response = await api.patch<UserProfile>(
    '/users/me',
    dados
  )

  return response.data
}