import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import PageContainer from '../../components/ui/PageContainer'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

import { useAuth } from '../../contexts/AuthContext'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (loading) return

    if (!email.trim() || !password.trim()) {
      setError('Informe seu e-mail e sua senha.')
      return
    }

    try {
      setLoading(true)
      setError('')

      await login({
        email: email.trim(),
        password,
      })

      navigate('/dashboard')
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        'Não foi possível realizar o login.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer
      className="bg-[#F8FAFC]"
      centerContent
    >
      <Card className="w-full max-w-[420px] rounded-3xl p-8 shadow-xl shadow-slate-900/10">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold text-[#1F2937]">
              Bem-vindo
            </h1>

            <p className="text-sm text-slate-600">
              Entre para acessar o Racha Fácil
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

            <Input
              label="Senha"
              password
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                navigate('/forgot-password')
              }
              className="rounded-md text-sm font-medium text-[#16A34A] transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]/40"
            >
              Esqueci minha senha
            </button>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Entrar
          </Button>

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="h-px flex-1 bg-slate-200" />
            <span>ou</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/register')}
            fullWidth
          >
            Criar conta
          </Button>
        </form>
      </Card>
    </PageContainer>
  )
}

export default LoginPage