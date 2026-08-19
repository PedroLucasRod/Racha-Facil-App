import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/ui/PageContainer'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (loading) return

    if (!email.trim()) {
      return
    }

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      navigate('/login')
    }, 1500)
  }

  return (
    <PageContainer className="bg-[#F8FAFC]" centerContent>
      <Card className="w-full max-w-[460px] rounded-3xl p-8 shadow-xl shadow-slate-900/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold text-[#1F2937]">Esqueceu sua senha?</h1>
            <p className="text-sm text-slate-600">Digite seu e-mail para receber um link de redefinição.</p>
          </div>

          <div className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Enviar link
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
            Voltar para Login
          </Button>
        </form>
      </Card>
    </PageContainer>
  )
}

export default ForgotPasswordPage
