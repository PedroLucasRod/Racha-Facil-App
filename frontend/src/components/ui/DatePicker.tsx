import React, { useId } from 'react'
import Button from './Button'

type DatePickerProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

const DatePicker: React.FC<DatePickerProps> = ({
  label = 'Data do racha',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  const generatedId = useId()
  const errorId = `${generatedId}-error`

  const [year, month, day] = value
    ? value.split('-')
    : ['', '', '']

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextDay = event.target.value

    if (!nextDay) {
      onChange('')
      return
    }

    onChange(
      `${year || new Date().getFullYear()}-${month || '01'}-${nextDay}`
    )
  }

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextMonth = event.target.value

    if (!nextMonth) {
      onChange('')
      return
    }

    onChange(
      `${year || new Date().getFullYear()}-${nextMonth}-${day || '01'}`
    )
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextYear = event.target.value

    if (!nextYear) {
      onChange('')
      return
    }

    onChange(
      `${nextYear}-${month || '01'}-${day || '01'}`
    )
  }

  const handleToday = () => {
    const today = new Date()

    const todayYear = today.getFullYear()
    const todayMonth = String(today.getMonth() + 1).padStart(2, '0')
    const todayDay = String(today.getDate()).padStart(2, '0')

    onChange(`${todayYear}-${todayMonth}-${todayDay}`)
  }

  const formatLongDate = () => {
    if (!value) {
      return null
    }

    const selectedDate = new Date(`${value}T12:00:00`)

    return selectedDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const currentYear = new Date().getFullYear()

  const years = Array.from(
    { length: 5 },
    (_, index) => currentYear + index
  )

  const months = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ]

  return (
    <div className="space-y-3">
      <label
        htmlFor={`${generatedId}-day`}
        className="block text-sm font-medium text-[#1F2937]"
      >
        {label}
        {required ? (
          <span className="ml-1 text-[#EF4444]">*</span>
        ) : null}
      </label>

      <div
        className={[
          'rounded-2xl border bg-white p-4 shadow-sm',
          error ? 'border-rose-500' : 'border-slate-200',
          disabled ? 'opacity-60' : '',
        ].join(' ')}
      >
        <div className="grid grid-cols-[1fr_1.3fr_1.2fr] gap-3">
          <div>
            <label
              htmlFor={`${generatedId}-day`}
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Dia
            </label>

            <select
              id={`${generatedId}-day`}
              value={day}
              onChange={handleDayChange}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-3 text-lg font-semibold text-[#0F172A] shadow-sm outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/40 disabled:cursor-not-allowed"
            >
              <option value="">Dia</option>

              {Array.from({ length: 31 }, (_, index) => {
                const dateDay = String(index + 1).padStart(2, '0')

                return (
                  <option key={dateDay} value={dateDay}>
                    {dateDay}
                  </option>
                )
              })}
            </select>
          </div>

          <div>
            <label
              htmlFor={`${generatedId}-month`}
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Mês
            </label>

            <select
              id={`${generatedId}-month`}
              value={month}
              onChange={handleMonthChange}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-3 text-base font-semibold text-[#0F172A] shadow-sm outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/40 disabled:cursor-not-allowed"
            >
              <option value="">Mês</option>

              {months.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={`${generatedId}-year`}
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Ano
            </label>

            <select
              id={`${generatedId}-year`}
              value={year}
              onChange={handleYearChange}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-3 text-lg font-semibold text-[#0F172A] shadow-sm outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/40 disabled:cursor-not-allowed"
            >
              <option value="">Ano</option>

              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {formatLongDate() ? (
              <p className="text-sm font-medium capitalize text-[#16A34A]">
                {formatLongDate()}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Selecione dia, mês e ano.
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToday}
            disabled={disabled}
          >
            Hoje
          </Button>
        </div>
      </div>

      {error ? (
        <p id={errorId} className="text-sm text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default DatePicker