import React, { useEffect, useState } from 'react'

import MainLayout from '../../layouts/MainLayout'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'

import {
  listarParticipantes,
  listarRachas,
  entrarNoRacha,
  sairDoRacha,
  type Racha,
  type RachaParticipant,
} from '../../services/rachaService'

import { useAuth } from '../../contexts/AuthContext'

type GameStatus = 'Aberto' | 'Encerrado' | 'Cancelado'

type Game = {
  id: number
  date: string
  location: string
  status: GameStatus
  maxPlayers: number
  maxGoalkeepers: number
  participants: RachaParticipant[]
  playersCount: number
  goalkeepersCount: number
  userConfirmed: boolean
  userWaiting: boolean
}

const statusVariantMap: Record<
  GameStatus,
  'success' | 'warning' | 'danger'
> = {
  Aberto: 'success',
  Encerrado: 'warning',
  Cancelado: 'danger',
}


const formatDate = (dateValue: string) => {
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return {
      day: '',
      date: dateValue,
      time: '',
    }
  }

  return {
    day: date.toLocaleDateString('pt-BR', {
      weekday: 'long',
    }),

    date: date.toLocaleDateString('pt-BR'),

    time: date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

const getEffectiveStatus = (
  racha: Racha
): GameStatus => {
  if (racha.status === 'Cancelado') {
    return 'Cancelado'
  }

  const rachaDate = new Date(racha.date)
  const agora = new Date()

  if (rachaDate < agora) {
    return 'Encerrado'
  }

  return 'Aberto'
}

const rachaToGame = (
  racha: Racha,
  participants: RachaParticipant[],
  userId?: number
): Game => {
  const confirmedParticipants = participants.filter(
    (participant) =>
      participant.participation_status === 'Confirmado'
  )

  const playersCount = confirmedParticipants.filter(
    (participant) =>
      participant.role === 'Jogador'
  ).length

  const goalkeepersCount = confirmedParticipants.filter(
    (participant) =>
      participant.role === 'Goleiro'
  ).length

  const userParticipation = participants.find(
    (participant) =>
      participant.user_id === userId
  )

  return {
    id: racha.id,
    date: racha.date,
    location: racha.location,
    status: getEffectiveStatus(racha),    
    maxPlayers: racha.max_players,
    maxGoalkeepers: racha.max_goalkeepers,
    participants,
    playersCount,
    goalkeepersCount,
    userConfirmed:
      userParticipation?.participation_status ===
      'Confirmado',
    userWaiting:
      userParticipation?.participation_status ===
      'Lista de Espera',
  }
}

const GamesPage: React.FC = () => {
  const { user } = useAuth()

  const [games, setGames] = useState<Game[]>([])
  const [selectedGameId, setSelectedGameId] =
    useState<number | null>(null)

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  const loadGames = async () => {
    try {
      setLoading(true)
      setError('')

      const rachas = await listarRachas()

      const gamesWithParticipants = await Promise.all(
        rachas.map(async (racha) => {
          const participants =
            await listarParticipantes(racha.id)

          return rachaToGame(
            racha,
            participants,
            user?.id
          )
        })
      )

      const gamesOrdenados = [...gamesWithParticipants].sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )

      setGames(gamesOrdenados)

      setSelectedGameId((currentSelectedId) => {
        if (
          currentSelectedId !== null &&
          gamesWithParticipants.some(
            (game) =>
              game.id === currentSelectedId
          )
        ) {
          return currentSelectedId
        }

        const proximoJogo = gamesWithParticipants
          .filter((game) => game.status === 'Aberto')
          .sort(
            (a, b) =>
              new Date(a.date).getTime() -
              new Date(b.date).getTime()
          )[0]

        return proximoJogo?.id ?? null
      })
    } catch (err) {
      console.error(err)

      setError(
        'Não foi possível carregar os jogos.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGames()
  }, [user?.id])

  const selectedGame =
    games.find(
      (game) => game.id === selectedGameId
    ) ?? null

  const handleToggleAttendance = async (
    gameId: number
  ) => {

    if (actionLoading) {
      return
    }

    const game = games.find(
      (item) => item.id === gameId
    )

    if (!game) {
      return
    }

    if (game.status !== 'Aberto') {
      return
    }

    try {
      setActionLoading(true)
      setError('')

      if (game.userConfirmed || game.userWaiting) {
        await sairDoRacha(game.id)
      } else {
        await entrarNoRacha(
          game.id,
          user?.preferred_role ?? 'Jogador'
        )
      }

      const participants =
        await listarParticipantes(game.id)

      const updatedGame = rachaToGame(
        {
          id: game.id,
          date: game.date,
          location: game.location,
          status: game.status,
          max_players: game.maxPlayers,
          max_goalkeepers: game.maxGoalkeepers,
          created_at: '',
        },
        participants,
        user?.id
      )

      setGames((currentGames) =>
        currentGames.map((currentGame) =>
          currentGame.id === game.id
            ? updatedGame
            : currentGame
        )
      )
    } catch (err: any) {
      console.error(err)

      const detail =
        err?.response?.data?.detail

      setError(
        detail ||
          'Não foi possível atualizar sua presença.'
      )
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto w-full max-w-6xl">
          <Card className="rounded-3xl p-8 text-center shadow-md">
            <p className="text-sm text-slate-600">
              Carregando jogos...
            </p>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-[#0F172A]">
            Jogos
          </h1>

          <p className="text-sm text-slate-600">
            Próximos jogos
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {games.length === 0 ? (
          <Card className="rounded-3xl p-8 text-center shadow-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              ⚽
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-[#0F172A]">
              Nenhum jogo cadastrado
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Crie um novo racha para que ele
              apareça aqui.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

            <div className="space-y-4">

              {games.map((game) => {
                const isSelected =
                  selectedGame?.id === game.id

                const formatted =
                  formatDate(game.date)

                return (
                  <Card
                    key={game.id}
                    className={`rounded-3xl p-6 shadow-md ${
                      isSelected
                        ? 'ring-2 ring-[#16A34A]/30'
                        : ''
                    }`}
                    hover
                    onClick={() =>
                      setSelectedGameId(game.id)
                    }
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Enter' ||
                        event.key === ' '
                      ) {
                        event.preventDefault()

                        setSelectedGameId(game.id)
                      }
                    }}
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="space-y-2">

                        <div className="flex flex-wrap items-center gap-3">

                          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                            {formatted.day}
                          </span>

                          <Badge
                            variant={
                              statusVariantMap[
                                game.status
                              ]
                            }
                            size="sm"
                          >
                            {game.status}
                          </Badge>

                        </div>

                        <p className="text-sm font-medium text-slate-500">
                          {formatted.date}
                        </p>

                        <p className="text-2xl font-semibold text-slate-900">
                          {formatted.time}
                        </p>

                        <p className="text-sm text-slate-500">
                          {game.location}
                        </p>

                      </div>

                      <div className="rounded-3xl bg-slate-50 px-5 py-4 text-center">

                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Vagas
                        </p>

                        <p className="mt-2 text-3xl font-semibold text-[#0F172A]">
                          {game.playersCount}/
                          {game.maxPlayers}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {game.goalkeepersCount}/
                          {game.maxGoalkeepers}{' '}
                          goleiros
                        </p>

                      </div>

                    </div>
                  </Card>
                )
              })}

            </div>

            {selectedGame ? (
              <Card className="rounded-3xl p-6 shadow-md">

                <div className="space-y-5">

                  <div className="space-y-2">

                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#16A34A]">
                      Detalhes do jogo
                    </p>

                    <h2 className="text-2xl font-semibold text-[#0F172A]">
                      {formatDate(
                        selectedGame.date
                      ).day}{' '}
                      •{' '}
                      {formatDate(
                        selectedGame.date
                      ).time}
                    </h2>

                    <p className="text-sm font-medium text-slate-500">
                      {formatDate(
                        selectedGame.date
                      ).date}
                    </p>

                    <p className="text-sm text-slate-600">
                      {selectedGame.location}
                    </p>

                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    <Badge
                      variant={
                        statusVariantMap[
                          selectedGame.status
                        ]
                      }
                      size="sm"
                    >
                      {selectedGame.status}
                    </Badge>

                    {selectedGame.userConfirmed ? (
                      <Badge
                        variant="success"
                        size="sm"
                      >
                        Presença confirmada
                      </Badge>
                    ) : null}

                    {selectedGame.userWaiting ? (
                      <Badge
                        variant="warning"
                        size="sm"
                      >
                        Lista de espera
                      </Badge>
                    ) : null}

                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Vagas
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-3">

                      <div>
                        <p className="text-sm text-slate-500">
                          Jogadores
                        </p>

                        <p className="text-2xl font-semibold text-[#0F172A]">
                          {selectedGame.playersCount}/
                          {selectedGame.maxPlayers}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">
                          Goleiros
                        </p>

                        <p className="text-2xl font-semibold text-[#0F172A]">
                          {selectedGame.goalkeepersCount}/
                          {selectedGame.maxGoalkeepers}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">
                          Total
                        </p>

                        <p className="text-2xl font-semibold text-[#0F172A]">
                          {selectedGame.playersCount +
                            selectedGame.goalkeepersCount}
                          /
                          {selectedGame.maxPlayers +
                            selectedGame.maxGoalkeepers}
                        </p>
                      </div>

                    </div>

                  </div>

                  {selectedGame.status ===
                  'Cancelado' ? (

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                      <p className="font-semibold">
                        Jogo cancelado
                      </p>

                      <p className="mt-1">
                        Não é possível confirmar
                        presença neste jogo.
                      </p>

                    </div>

                  ) : selectedGame.status ===
                    'Encerrado' ? (

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                      <p className="font-semibold">
                        Jogo encerrado
                      </p>

                      <p className="mt-1">
                        Não é possível confirmar
                        presença neste jogo.
                      </p>

                    </div>

                  ) : (

                    <div className="space-y-4">

                      <Button
                        fullWidth
                        variant={
                          selectedGame.userConfirmed ||
                          selectedGame.userWaiting
                            ? 'outline'
                            : 'primary'
                        }
                        onClick={() =>
                          handleToggleAttendance(
                            selectedGame.id
                          )
                        }
                        disabled={
                          actionLoading ||
                          (
                            selectedGame.playersCount >=
                              selectedGame.maxPlayers &&
                            !selectedGame.userConfirmed &&
                            !selectedGame.userWaiting
                          )
                        }
                        loading={actionLoading}
                      >
                        {selectedGame.userConfirmed
                          ? 'Cancelar presença'
                          : selectedGame.userWaiting
                            ? 'Sair da lista de espera'
                            : 'Confirmar presença'}
                      </Button>

                      {selectedGame.playersCount >=
                        selectedGame.maxPlayers &&
                      !selectedGame.userConfirmed &&
                      !selectedGame.userWaiting ? (
                        <p className="text-sm text-[#EF4444]">
                          Não há mais vagas de
                          jogadores disponíveis
                          para este jogo.
                        </p>
                      ) : null}

                    </div>

                  )}

                  <div className="space-y-3">

                    <h3 className="text-lg font-semibold text-[#0F172A]">
                      Participantes
                    </h3>

                    {selectedGame.participants
                      .length === 0 ? (

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
                        Nenhum participante
                        confirmado ainda.
                      </div>

                    ) : (

                      <div className="space-y-2">

                        {selectedGame.participants
                          .filter(
                            (participant) =>
                              participant.participation_status ===
                              'Confirmado'
                          )
                          .map(
                            (participant) => (
                              <div
                                key={
                                  participant.id
                                }
                                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                              >

                                <div className="flex min-w-0 items-center gap-3">

                                  <Avatar
                                    name={
                                      participant.user_name
                                    }
                                    size="lg"
                                  />

                                  <div className="min-w-0">

                                    <p className="truncate font-semibold text-[#0F172A]">
                                      {
                                        participant.user_name
                                      }
                                    </p>

                                    <p className="text-sm text-slate-500">
                                      {
                                        participant.role
                                      }
                                    </p>

                                  </div>

                                </div>

                                <Badge
                                  variant={
                                    participant.role ===
                                    'Goleiro'
                                      ? 'warning'
                                      : 'success'
                                  }
                                  size="sm"
                                >
                                  {
                                    participant.role
                                  }
                                </Badge>

                              </div>
                            )
                          )}

                      </div>

                    )}

                  </div>

                </div>

              </Card>
            ) : null}

          </div>
        )}

      </div>
    </MainLayout>
  )
}

export default GamesPage