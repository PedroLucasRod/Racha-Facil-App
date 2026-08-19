import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import MainLayout from '../../layouts/MainLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'

import {
  listarRachas,
  listarParticipantes,
  type Racha,
  type RachaParticipant,
} from '../../services/rachaService'

const PlayersPage: React.FC = () => {
  const navigate = useNavigate()

  const [racha, setRacha] = useState<Racha | null>(null)
  const [participantes, setParticipantes] = useState<RachaParticipant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const carregarDados = async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const rachas = await listarRachas()

      if (rachas.length === 0) {
        setRacha(null)
        setParticipantes([])
        return
      }

      const proximoRacha = [...rachas]
        .filter((item) => item.status !== 'Cancelado')
        .sort(
          (a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
        )[0]

      if (!proximoRacha) {
        setRacha(null)
        setParticipantes([])
        return
      }

      setRacha(proximoRacha)

      const listaParticipantes =
        await listarParticipantes(proximoRacha.id)

      setParticipantes(listaParticipantes)
    } catch (error: any) {
      console.error(
        'Erro ao carregar participantes:',
        error
      )

      if (error?.response?.status === 401) {
        setErrorMessage(
          'Sua sessão expirou. Faça login novamente.'
        )
      } else {
        setErrorMessage(
          'Não foi possível carregar os participantes.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const players = useMemo(
    () =>
      participantes.filter(
        (participant) =>
          participant.role === 'Jogador' &&
          participant.participation_status === 'Confirmado'
      ),
    [participantes]
  )

  const goalkeepers = useMemo(
    () =>
      participantes.filter(
        (participant) =>
          participant.role === 'Goleiro' &&
          participant.participation_status === 'Confirmado'
      ),
    [participantes]
  )

  const fieldPlayersCount = players.length
  const goalkeeperCount = goalkeepers.length
  const totalParticipantsCount =
    fieldPlayersCount + goalkeeperCount

  const maxFieldPlayers = racha?.max_players ?? 20
  const maxGoalkeepers = racha?.max_goalkeepers ?? 4
  const maxParticipants =
    maxFieldPlayers + maxGoalkeepers

  if (isLoading) {
    return (
      <MainLayout>
        <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center">
          <Card className="rounded-3xl p-8 text-center shadow-md">
            <p className="text-sm text-slate-600">
              Carregando participantes...
            </p>
          </Card>
        </div>
      </MainLayout>
    )
  }

  if (errorMessage) {
    return (
      <MainLayout>
        <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center">
          <Card className="w-full max-w-2xl rounded-3xl p-8 text-center shadow-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
              ⚠️
            </div>

            <h1 className="mt-5 text-2xl font-semibold text-[#0F172A]">
              Não foi possível carregar os participantes
            </h1>

            <p className="mt-3 text-sm text-slate-600">
              {errorMessage}
            </p>

            <div className="mt-6">
              <Button onClick={carregarDados}>
                Tentar novamente
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    )
  }

  if (!racha) {
    return (
      <MainLayout>
        <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center">
          <Card className="w-full max-w-2xl rounded-3xl p-8 text-center shadow-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              ⚽
            </div>

            <h1 className="mt-5 text-3xl font-semibold text-[#0F172A]">
              Nenhum racha cadastrado
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
              Ainda não existe um racha disponível para
              visualizar os participantes.
            </p>

            <div className="mt-6">
              <Button
                onClick={() => navigate('/dashboard')}
              >
                Voltar ao dashboard
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-[#0F172A]">
              Jogadores Confirmados
            </h1>

            <p className="text-sm text-slate-600">
              Próximo racha
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Voltar
          </Button>
        </div>

        <Card className="rounded-3xl p-6 shadow-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#16A34A]">
                Resumo
              </p>

              <h2 className="text-2xl font-semibold text-[#0F172A]">
                Quem está confirmado no próximo racha?
              </h2>

              <p className="text-sm text-slate-600">
                Acompanhe as vagas de jogadores, goleiros e
                o total de participantes do próximo racha.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#16A34A] p-4 text-white shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-100">
                  Jogadores
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {fieldPlayersCount}/{maxFieldPlayers}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Goleiros
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#0F172A]">
                  {goalkeeperCount}/{maxGoalkeepers}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Total
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#0F172A]">
                  {totalParticipantsCount}/{maxParticipants}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl p-5 shadow-md sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Lista de participantes
              </h2>

              <p className="text-sm text-slate-600">
                Participantes confirmados para o próximo racha
              </p>
            </div>

            <Button
              variant="outline"
              onClick={carregarDados}
            >
              Atualizar
            </Button>
          </div>

          {participantes.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {participantes
                .filter(
                  (participant) =>
                    participant.participation_status ===
                    'Confirmado'
                )
                .map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar
                        name={participant.user_name}
                        size="lg"
                      />

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#0F172A]">
                          {participant.user_name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {participant.role}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={
                        participant.role === 'Goleiro'
                          ? 'warning'
                          : 'success'
                      }
                      size="sm"
                    >
                      {participant.role === 'Goleiro'
                        ? 'Goleiro'
                        : 'Confirmado'}
                    </Badge>
                  </div>
                ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-lg font-semibold text-[#0F172A]">
                Nenhum jogador confirmado ainda
              </p>

              <p className="mt-2 text-sm text-slate-600">
                A lista do próximo racha aparecerá aqui.
              </p>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  )
}

export default PlayersPage