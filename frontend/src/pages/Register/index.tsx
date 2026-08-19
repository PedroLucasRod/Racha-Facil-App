import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/ui/PageContainer'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

import api from '../../services/api'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (loading) return

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError('Preencha todos os campos.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    try {
      setLoading(true)
      setError('')

      await api.post('/users/', {
        name: fullName.trim(),
        email: email.trim(),
        password,
      })

      navigate('/login')
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        'Não foi possível criar sua conta.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  {error && (
    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
      {error}
    </div>
  )}

  return (
    <PageContainer className="bg-[#F8FAFC]" centerContent>
      <Card className="w-full max-w-[460px] rounded-3xl p-8 shadow-xl shadow-slate-900/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold text-[#1F2937]">Criar conta</h1>
            <p className="text-sm text-slate-600">Preencha os dados para criar sua conta</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              placeholder="Seu nome completo"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              label="Telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <Input
              label="Senha"
              password
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Input
              label="Confirmar senha"
              password
              placeholder="Repita sua senha"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Criar conta
          </Button>

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="h-px flex-1 bg-slate-200" />
            <span>ou</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={() => navigate('/login')}
          >
            Já tenho uma conta
          </Button>
        </form>
      </Card>
    </PageContainer>
  )
}

export default RegisterPage
