import React from 'react'
import MainLayout from '../../layouts/MainLayout'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  const tipoUsuario = user.is_admin
    ? 'Administrador'
    : 'Jogador'

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-4xl space-y-6">

        <Card className="rounded-3xl p-6 shadow-md sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">

            <Avatar
              name={user.name}
              size="xl"
            />

            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-[#0F172A]">
                  {user.name}
                </h1>

                <p className="text-sm text-slate-600">
                  {user.email}
                </p>
              </div>

              <div className="inline-flex items-center rounded-full bg-[#16A34A]/10 px-3 py-1 text-sm font-medium text-[#16A34A]">
                {tipoUsuario}
              </div>
            </div>

          </div>
        </Card>

        <Card className="rounded-3xl p-6 shadow-md">
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Dados do usuário
            </h2>

            <p className="text-sm text-slate-600">
              Informações cadastradas no sistema
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                Nome
              </p>

              <p className="mt-2 text-lg font-semibold text-[#0F172A]">
                {user.name}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                E-mail
              </p>

              <p className="mt-2 text-lg font-semibold text-[#0F172A]">
                {user.email}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                Tipo
              </p>

              <p className="mt-2 text-lg font-semibold text-[#0F172A]">
                {tipoUsuario}
              </p>
            </div>

          </div>
        </Card>

        <Card className="rounded-3xl p-6 shadow-md">
          <div className="space-y-4">

            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Conta
              </h2>

              <p className="text-sm text-slate-600">
                Gerencie sua sessão no Racha Fácil
              </p>
            </div>

            <Button
              fullWidth
              variant="outline"
              onClick={logout}
            >
              Sair
            </Button>

          </div>
        </Card>

      </div>
    </MainLayout>
  )
}

export default ProfilePage