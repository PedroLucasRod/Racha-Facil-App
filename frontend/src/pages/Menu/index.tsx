import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import MainLayout from '../../layouts/MainLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { atualizarMeuPerfil } from '../../services/useService'

type ParticipationRole = 'Jogador' | 'Goleiro'

const MenuPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()

  const [participationRole, setParticipationRole] =
    useState<ParticipationRole>(
      user?.preferred_role ?? 'Jogador'
    )

  const [savingRole, setSavingRole] = useState(false)

  useEffect(() => {
    if (user?.preferred_role) {
      setParticipationRole(user.preferred_role)
    }
  }, [user?.preferred_role])

  const handleRoleChange = async (
    role: ParticipationRole
  ) => {
    if (!user || role === participationRole) {
      return
    }

    const previousRole = participationRole

    setParticipationRole(role)
    setSavingRole(true)

    try {
      const usuarioAtualizado = await atualizarMeuPerfil({
        name: user.name,
        email: user.email,
        preferred_role: role,
      })

      updateUser(usuarioAtualizado)
    } catch {
      setParticipationRole(previousRole)
    } finally {
      setSavingRole(false)
    }
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-3xl space-y-6">

        {/* Título */}

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-[#0F172A]">
            Configurações
          </h1>

          <p className="text-sm text-slate-600">
            Configure como você participa dos rachas.
          </p>
        </div>

        {/* Tipo de participação */}

        <Card className="rounded-3xl p-6 shadow-md">
          <div className="space-y-5">

            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Tipo de participação
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Escolha como você prefere participar dos rachas.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              {/* Jogador */}

              <button
                type="button"
                disabled={savingRole}
                onClick={() =>
                  handleRoleChange('Jogador')
                }
                className={`
                  rounded-2xl border p-5 text-left
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                  ${
                    participationRole === 'Jogador'
                      ? 'border-[#16A34A] bg-[#F0FDF4] ring-2 ring-[#16A34A]/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex items-center gap-4">

                  <div
                    className={`
                      flex h-12 w-12 shrink-0 items-center justify-center
                      rounded-2xl text-2xl
                      ${
                        participationRole === 'Jogador'
                          ? 'bg-[#16A34A] text-white'
                          : 'bg-slate-100'
                      }
                    `}
                  >
                    ⚽
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-[#0F172A]">
                      Jogador
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Participar como jogador de linha.
                    </p>
                  </div>

                </div>
              </button>

              {/* Goleiro */}

              <button
                type="button"
                disabled={savingRole}
                onClick={() =>
                  handleRoleChange('Goleiro')
                }
                className={`
                  rounded-2xl border p-5 text-left
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                  ${
                    participationRole === 'Goleiro'
                      ? 'border-[#16A34A] bg-[#F0FDF4] ring-2 ring-[#16A34A]/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex items-center gap-4">

                  <div
                    className={`
                      flex h-12 w-12 shrink-0 items-center justify-center
                      rounded-2xl text-2xl
                      ${
                        participationRole === 'Goleiro'
                          ? 'bg-[#16A34A] text-white'
                          : 'bg-slate-100'
                      }
                    `}
                  >
                    🧤
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-[#0F172A]">
                      Goleiro
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Participar como goleiro.
                    </p>
                  </div>

                </div>
              </button>

            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">
                Essa preferência será usada automaticamente
                quando você confirmar presença em um racha.
              </p>
            </div>

          </div>
        </Card>

        {/* Administração */}

        {user?.is_admin && (
          <Card className="rounded-3xl p-6 shadow-md">
            <div className="space-y-4">

              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">
                  Administração
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Gerencie os rachas do sistema.
                </p>
              </div>

              <Button
                fullWidth
                variant="outline"
                onClick={() =>
                  navigate('/manage-racha')
                }
              >
                Gerenciar racha
              </Button>

            </div>
          </Card>
        )}

      </div>
    </MainLayout>
  )
}

export default MenuPage