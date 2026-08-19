import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import MainLayout from '../../layouts/MainLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import TimePicker from '../../components/ui/TimePicker'
import DatePicker from '../../components/ui/DatePicker'

import {
  criarRacha,
  type Racha,
} from '../../services/rachaService'

type FormValues = {
  date: string
  time: string
  location: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const CreateManageRachaPage: React.FC = () => {
  const navigate = useNavigate()

  const [formValues, setFormValues] = useState<FormValues>({
    date: '',
    time: '',
    location: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [createdRacha, setCreatedRacha] =
    useState<Racha | null>(null)

  const weekdayLabel = useMemo(() => {
    if (!formValues.date) {
      return 'Sábado'
    }

    const date = new Date(`${formValues.date}T00:00:00`)

    if (Number.isNaN(date.getTime())) {
      return 'Sábado'
    }

    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
    }).replace(/^(.)/, (char) => char.toUpperCase())
  }, [formValues.date])

  useEffect(() => {
    if (!isSaved) {
      return
    }

    const timer = window.setTimeout(() => {
      navigate('/manage-racha')
    }, 900)

    return () => {
      window.clearTimeout(timer)
    }
  }, [isSaved, navigate])

  const handleChange = (
    field: keyof FormValues,
    value: string
  ) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))

    setErrorMessage('')
    setIsSaved(false)
  }

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!formValues.date.trim()) {
      nextErrors.date = 'A data do racha é obrigatória.'
    }

    if (!formValues.time.trim()) {
      nextErrors.time = 'O horário do racha é obrigatório.'
    }

    if (!formValues.location.trim()) {
      nextErrors.location =
        'O local do racha é obrigatório.'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    if (isSaving) {
      return
    }

    try {
      setIsSaving(true)
      setErrorMessage('')
      setIsSaved(false)

      /*
       * O backend espera um datetime.
       *
       * Exemplo:
       * 2026-08-16 + 18:30
       *
       * vira:
       * 2026-08-16T18:30:00
       */
      const dateTime = `${formValues.date}T${formValues.time}:00`

      const novoRacha = await criarRacha({
        date: dateTime,
        location: formValues.location.trim(),
        status: 'Aberto',
        max_players: 20,
        max_goalkeepers: 4,
      })

      setCreatedRacha(novoRacha)
      setIsSaved(true)
    } catch (err: any) {
      console.error('Erro ao criar racha:', err)

      const detail =
        err?.response?.data?.detail

      if (detail) {
        setErrorMessage(detail)
      } else if (err?.response?.status === 401) {
        setErrorMessage(
          'Sua sessão expirou. Faça login novamente.'
        )
      } else if (err?.response?.status === 403) {
        setErrorMessage(
          'Seu usuário não possui permissão para criar um racha.'
        )
      } else {
        setErrorMessage(
          'Não foi possível criar o racha. Verifique sua conexão com o servidor.'
        )
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/manage-racha')
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-5xl space-y-6">

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-[#0F172A]">
            Criar racha
          </h1>

          <p className="text-sm text-slate-600">
            Defina a data, o horário e o local do próximo
            racha.
          </p>
        </div>

        <Card className="rounded-3xl p-6 shadow-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

            <div className="space-y-2">

              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#16A34A]">
                Pré-visualização
              </p>

              <h2 className="text-2xl font-semibold text-[#0F172A]">
                {weekdayLabel} •{' '}
                {formValues.time || '—'}
              </h2>

              <p className="text-sm text-slate-600">
                {formValues.date
                  ? formValues.date
                  : 'Defina a data'}
                {' • '}
                {formValues.location ||
                  'Defina o local'}
              </p>

            </div>

            <Badge variant="success" size="sm">
              Novo racha
            </Badge>

          </div>
        </Card>

        <Card className="rounded-3xl p-6 shadow-md">

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >

            <div className="grid gap-5 md:grid-cols-2">

              <DatePicker
                label="Data do racha"
                value={formValues.date}
                onChange={(value) =>
                  handleChange('date', value)
                }
                error={errors.date}
                required
              />

              <TimePicker
                label="Horário do racha"
                value={formValues.time}
                onChange={(value) =>
                  handleChange('time', value)
                }
                error={errors.time}
                required
              />

            </div>

            <Input
              label="Local do racha"
              value={formValues.location}
              onChange={(event) =>
                handleChange(
                  'location',
                  event.target.value
                )
              }
              error={errors.location}
              placeholder="Ex.: Farol Church"
              required
            />

            {errorMessage ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                <p className="font-semibold">
                  Não foi possível criar o racha
                </p>

                <p className="mt-1">
                  {errorMessage}
                </p>

              </div>
            ) : null}

            {isSaved ? (
              <div className="rounded-2xl border border-[#16A34A]/30 bg-[#F0FDF4] p-4 text-sm text-[#166534]">

                <p className="font-semibold">
                  Racha criado com sucesso!
                </p>

                <p className="mt-1">
                  O racha foi salvo no banco de dados.
                  As páginas Início e Jogos poderão
                  reconhecê-lo.
                </p>

                {createdRacha ? (
                  <p className="mt-2 text-xs text-[#166534]/80">
                    ID do racha: {createdRacha.id}
                  </p>
                ) : null}

              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                loading={isSaving}
                disabled={isSaving}
              >
                {isSaving
                  ? 'Criando racha...'
                  : 'Criar racha'}
              </Button>

            </div>

          </form>

        </Card>

      </div>
    </MainLayout>
  )
}

export default CreateManageRachaPage