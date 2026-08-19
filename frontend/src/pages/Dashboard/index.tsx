import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import MainLayout from '../../layouts/MainLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'

import {
  entrarNoRacha,
  listarParticipantes,
  listarRachas,
  sairDoRacha,
  type Racha,
  type RachaParticipant,
} from '../../services/rachaService'

import { useAuth } from '../../contexts/AuthContext'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [racha, setRacha] = useState<Racha | null>(null)
  const [participantes, setParticipantes] = useState<RachaParticipant[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  const carregarRacha = async () => {
    try {
      setLoading(true)
      setError('')

      const rachas = await listarRachas()

      /*
       * REGRA DO PRÓXIMO RACHA:
       *
       * 1. Não pode estar cancelado
       * 2. A data/hora precisa ser futura ou igual ao momento atual
       * 3. Entre os válidos, pegamos o mais próximo
       */
      const agora = new Date()

      const proximosRachas = rachas
        .filter((item) => item.status !== 'Cancelado')
        .filter((item) => {
          const dataRacha = new Date(item.date)

          return (
            !Number.isNaN(dataRacha.getTime()) &&
            dataRacha >= agora
          )
        })
        .sort(
          (a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
        )

      const proximoRacha = proximosRachas[0]

      if (!proximoRacha) {
        setRacha(null)
        setParticipantes([])
        return
      }

      setRacha(proximoRacha)

      const participantesData = await listarParticipantes(
        proximoRacha.id
      )

      setParticipantes(participantesData)
    } catch (err) {
      console.error(err)

      setError(
        'Não foi possível carregar os dados do racha.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarRacha()
  }, [])

  const minhaParticipacao = participantes.find(
    (participant) => participant.user_id === user?.id
  )

  const confirmedPlayers = participantes
    .filter(
      (participant) =>
        participant.role === 'Jogador' &&
        participant.participation_status === 'Confirmado'
    )
    .slice(0, 6)

  const playersCount = participantes.filter(
    (participant) =>
      participant.role === 'Jogador' &&
      participant.participation_status === 'Confirmado'
  ).length

  const goalkeepersCount = participantes.filter(
    (participant) =>
      participant.role === 'Goleiro' &&
      participant.participation_status === 'Confirmado'
  ).length

  const isConfirmed =
    minhaParticipacao?.participation_status === 'Confirmado'

  const isWaiting =
    minhaParticipacao?.participation_status === 'Lista de Espera'

  const handleTogglePresence = async () => {
    if (!racha || actionLoading) {
      return
    }

    try {
      setActionLoading(true)
      setError('')

      if (minhaParticipacao) {
        await sairDoRacha(racha.id)
      } else {
        await entrarNoRacha(
          racha.id,
          user?.preferred_role ?? 'Jogador'
        )
      }

      const participantesAtualizados =
        await listarParticipantes(racha.id)

      setParticipantes(participantesAtualizados)
    } catch (err: any) {
      console.error(err)

      const detail = err?.response?.data?.detail

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
          <Card elevated className="rounded-3xl shadow-md">
            <div className="p-6 text-center">
              <p className="text-sm text-slate-600">
                Carregando próximo racha...
              </p>
            </div>
          </Card>
        </div>
      </MainLayout>
    )
  }

  if (error && !racha) {
    return (
      <MainLayout>
        <div className="mx-auto w-full max-w-6xl">
          <Card elevated className="rounded-3xl shadow-md">
            <div className="space-y-4 p-6 text-center">
              <h2 className="text-xl font-semibold text-[#0F172A]">
                Erro ao carregar
              </h2>

              <p className="text-sm text-red-600">
                {error}
              </p>

              <Button onClick={carregarRacha}>
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
        <div className="mx-auto w-full max-w-6xl">
          <Card elevated className="rounded-3xl shadow-md">
            <div className="space-y-4 p-6 text-center">
              <h2 className="text-xl font-semibold text-[#0F172A]">
                Nenhum próximo racha
              </h2>

              <p className="text-sm text-slate-600">
                Não existe nenhum racha futuro cadastrado.
              </p>
            </div>
          </Card>
        </div>
      </MainLayout>
    )
  }

  const date = new Date(racha.date)

  const formattedDate = date.toLocaleDateString(
    'pt-BR'
  )

  const formattedTime = date.toLocaleTimeString(
    'pt-BR',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  )

  const formattedDay = date.toLocaleDateString(
    'pt-BR',
    {
      weekday: 'long',
    }
  )

  const isActionAllowed =
    racha.status === 'Aberto'

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <Card
          elevated
          className="rounded-3xl shadow-md"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#16A34A]">
                Próximo jogo
              </p>

              <Badge
                variant={
                  isConfirmed
                    ? 'success'
                    : 'neutral'
                }
                size="sm"
              >
                {isConfirmed
                  ? 'Confirmado'
                  : isWaiting
                    ? 'Lista de espera'
                    : 'Não confirmado'}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  📅 Data
                </p>

                <p className="mt-3 text-lg font-semibold capitalize text-[#0F172A]">
                  {formattedDay}, {formattedDate}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  🕐 Horário
                </p>

                <p className="mt-3 text-lg font-semibold text-[#0F172A]">
                  {formattedTime}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  📍 Local
                </p>

                <p className="mt-3 text-lg font-semibold text-[#0F172A]">
                  {racha.location}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                fullWidth
                variant={
                  minhaParticipacao
                    ? 'secondary'
                    : 'primary'
                }
                onClick={handleTogglePresence}
                disabled={
                  !isActionAllowed ||
                  actionLoading
                }
                loading={actionLoading}
              >
                {minhaParticipacao
                  ? isWaiting
                    ? 'Sair da lista de espera'
                    : 'Cancelar presença'
                  : 'Confirmar presença'}
              </Button>
            </div>

            {error ? (
              <p className="text-sm text-red-600">
                {error}
              </p>
            ) : null}
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-3xl">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                Jogadores
              </p>

              <p className="text-4xl font-semibold text-[#0F172A]">
                {playersCount}/{racha.max_players}
              </p>
            </div>
          </Card>

          <Card className="rounded-3xl">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                Goleiros
              </p>

              <p className="text-4xl font-semibold text-[#0F172A]">
                {goalkeepersCount}/{racha.max_goalkeepers}
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Jogadores Confirmados
            </h2>

            <Button
              variant="outline"
              onClick={() => navigate('/players')}
            >
              Ver todos
            </Button>
          </div>

          {confirmedPlayers.length === 0 ? (
            <Card className="rounded-3xl">
              <div className="p-6 text-center">
                <p className="text-sm text-slate-500">
                  Nenhum jogador confirmado ainda.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
              {confirmedPlayers.map(
                (participant) => (
                  <div
                    key={participant.id}
                    className="flex flex-col items-center gap-2"
                  >
                    <Avatar
                      name={
                        participant.user_name
                      }
                      size="lg"
                    />

                    <span className="text-center text-xs text-slate-600">
                      {
                        participant.user_name.split(
                          ' '
                        )[0]
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default DashboardPage