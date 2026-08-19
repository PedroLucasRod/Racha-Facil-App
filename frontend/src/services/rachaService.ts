import api from './api'

export type Racha = {
  id: number
  date: string
  location: string
  status: string
  max_players: number
  max_goalkeepers: number
  created_at: string
}

export type RachaParticipant = {
  id: number
  racha_id: number
  user_id: number
  user_name: string
  user_email: string
  role: string
  payment_status: string
  participation_status: string
  confirmed_at: string
  queue_position: number | null
}

export type CriarRachaData = {
  date: string
  location: string
  status?: string
  max_players?: number
  max_goalkeepers?: number
}

export const listarRachas = async (): Promise<Racha[]> => {
  const response = await api.get<Racha[]>('/rachas/')

  return response.data
}

export const criarRacha = async (
  dados: CriarRachaData
): Promise<Racha> => {
  const response = await api.post<Racha>(
    '/rachas/',
    {
      date: dados.date,
      location: dados.location,
      status: dados.status ?? 'Aberto',
      max_players: dados.max_players ?? 20,
      max_goalkeepers: dados.max_goalkeepers ?? 4,
    }
  )

  return response.data
}

export const listarParticipantes = async (
  rachaId: number
): Promise<RachaParticipant[]> => {
  const response = await api.get<RachaParticipant[]>(
    `/rachas/${rachaId}/participantes`
  )

  return response.data
}

export const entrarNoRacha = async (
  rachaId: number,
  role: 'Jogador' | 'Goleiro' = 'Jogador'
): Promise<RachaParticipant> => {
  const response = await api.post<RachaParticipant>(
    `/rachas/${rachaId}/participantes`,
    {
      role,
    }
  )

  return response.data
}

export const sairDoRacha = async (
  rachaId: number
): Promise<void> => {
  await api.delete(`/rachas/${rachaId}/participantes`)
}