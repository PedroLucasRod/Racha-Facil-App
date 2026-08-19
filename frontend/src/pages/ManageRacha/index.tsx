import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import MainLayout from '../../layouts/MainLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Modal from '../../components/ui/Modal'
import { useAuth } from '../../contexts/AuthContext'

import {
  listarRachas,
  listarParticipantes,
  type Racha,
  type RachaParticipant,
} from '../../services/rachaService'

const statusVariantMap: Record<
  string,
  'success' | 'warning' | 'danger'
> = {
  Aberto: 'success',
  Encerrado: 'warning',
  Finalizado: 'warning',
  Cancelado: 'danger',
}

const ManageRachaPage: React.FC = () => {
  const navigate = useNavigate()

  const { user } = useAuth()

  const [racha, setRacha] = useState<Racha | null>(null)
  const [participantes, setParticipantes] = useState<
    RachaParticipant[]
  >([])

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

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

      const agora = new Date()

      const proximoRacha = [...rachas]
        .filter(
          (item) =>
            item.status !== 'Cancelado' &&
            new Date(item.date) > agora
        )
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
        'Erro ao carregar dados do racha:',
        error
      )

      if (error?.response?.status === 401) {
        setErrorMessage(
          'Sua sessão expirou. Faça login novamente.'
        )
      } else {
        setErrorMessage(
          'Não foi possível carregar os dados do racha.'
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

  const waitingList = useMemo(
    () =>
      participantes.filter(
        (participant) =>
          participant.participation_status ===
          'Lista de Espera'
      ),
    [participantes]
  )

  const totalParticipants =
    players.length + goalkeepers.length

  const remainingPlayers = racha
    ? Math.max(racha.max_players - players.length, 0)
    : 0

  const remainingGoalkeepers = racha
    ? Math.max(
        racha.max_goalkeepers - goalkeepers.length,
        0
      )
    : 0

  const handleCancel = () => {
    /*
     * Ainda não temos no rachaService a operação de
     * cancelamento integrada à API.
     *
     * Por enquanto apenas fechamos o modal.
     */
    setShowCancelConfirm(false)
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center">
          <Card className="rounded-3xl p-8 text-center shadow-md">
            <p className="text-sm text-slate-600">
              Carregando dados do racha...
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
              Não foi possível carregar o racha
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
              Crie o próximo racha para começar a receber
              confirmações dos jogadores e organizar a
              partida.
            </p>

            <div className="mt-6">
              <Button
                onClick={() =>
                  navigate('/manage-racha/create')
                }
              >
                + Criar novo racha
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-[#0F172A]">
              Gerenciar Racha
            </h1>

            <p className="text-sm text-slate-600">
              Controle o próximo racha diretamente pelo servidor.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <Badge
              variant={
                statusVariantMap[racha.status] ?? 'warning'
              }
              size="sm"
            >
              {racha.status}
            </Badge>

            {user?.is_admin && (
              <Button
                onClick={() => navigate('/manage-racha/create')}
              >
                + Criar novo racha
              </Button>
            )}
          </div>
        </div>

        <Card className="rounded-3xl p-6 shadow-md">
          <div className="space-y-4">

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#16A34A]">
                Próximo racha
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#0F172A]">
                {new Date(racha.date).toLocaleString(
                  'pt-BR',
                  {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  }
                )}
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                📍 {racha.location}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl bg-[#16A34A] p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Jogadores
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {players.length}/{racha.max_players}
                </p>

                <p className="mt-1 text-xs text-green-100">
                  {remainingPlayers} vagas restantes
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Goleiros
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#0F172A]">
                  {goalkeepers.length}/
                  {racha.max_goalkeepers}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {remainingGoalkeepers} vagas restantes
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Confirmados
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#0F172A]">
                  {totalParticipants}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {waitingList.length} na lista de espera
                </p>
              </div>

            </div>
          </div>
        </Card>

        <Card className="rounded-3xl p-5 shadow-md sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Participantes
              </h2>

              <p className="text-sm text-slate-600">
                Dados carregados diretamente do backend.
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
            <div className="space-y-3">

              {participantes.map((participant) => (
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

                  <div className="flex flex-col items-end gap-1">

                    <Badge
                      variant={
                        participant.participation_status ===
                        'Confirmado'
                          ? 'success'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {participant.participation_status}
                    </Badge>

                    {participant.participation_status ===
                      'Lista de Espera' &&
                      participant.queue_position && (
                        <span className="text-xs text-slate-500">
                          Posição #
                          {participant.queue_position}
                        </span>
                      )}

                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-lg font-semibold text-[#0F172A]">
                Nenhum participante ainda
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Os jogadores aparecerão aqui quando
                confirmarem presença.
              </p>
            </div>
          )}
        </Card>

        <Card className="rounded-3xl p-6 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Ações do racha
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Algumas ações administrativas ainda serão
                conectadas à API.
              </p>
            </div>

            <Button
              variant="danger"
              onClick={() =>
                setShowCancelConfirm(true)
              }
            >
              Cancelar racha
            </Button>

          </div>
        </Card>

      </div>

      <Modal
        open={showCancelConfirm}
        onClose={() =>
          setShowCancelConfirm(false)
        }
        title="Cancelar racha"
      >
        <div className="space-y-5">

          <p className="text-sm leading-6 text-slate-600">
            A ação de cancelamento ainda será conectada ao
            backend. Nenhuma alteração será feita enquanto
            essa integração não estiver pronta.
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() =>
                setShowCancelConfirm(false)
              }
            >
              Voltar
            </Button>

            <Button
              variant="danger"
              onClick={handleCancel}
            >
              Fechar
            </Button>
          </div>

        </div>
      </Modal>

    </MainLayout>
  )
}

export default ManageRachaPage