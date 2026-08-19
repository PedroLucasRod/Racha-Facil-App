import React, { useId } from 'react'
import Button from './Button'

type TimePickerProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

const QUICK_TIMES = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30']

const TimePicker: React.FC<TimePickerProps> = ({
  label = 'Horário do racha',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  const generatedId = useId()
  const errorId = `${generatedId}-error`

  const [hours, minutes] = value
    ? value.split(':')
    : ['', '']

  const handleHourChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextHour = event.target.value

    if (!nextHour) {
      onChange('')
      return
    }

    onChange(`${nextHour}:${minutes || '00'}`)
  }

  const handleMinuteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextMinute = event.target.value

    if (!nextMinute) {
      onChange('')
      return
    }

    onChange(`${hours || '19'}:${nextMinute}`)
  }

  const handleQuickTime = (time: string) => {
    onChange(time)
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor={`${generatedId}-hour`}
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
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label
              htmlFor={`${generatedId}-hour`}
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Hora
            </label>

            <select
              id={`${generatedId}-hour`}
              value={hours}
              onChange={handleHourChange}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-lg font-semibold text-[#0F172A] shadow-sm outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/40 disabled:cursor-not-allowed"
            >
              <option value="">Hora</option>

              {Array.from({ length: 24 }, (_, index) => {
                const hour = String(index).padStart(2, '0')

                return (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                )
              })}
            </select>
          </div>

          <span
            aria-hidden="true"
            className="mt-6 text-2xl font-bold text-slate-400"
          >
            :
          </span>

          <div className="flex-1">
            <label
              htmlFor={`${generatedId}-minute`}
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Minutos
            </label>

            <select
              id={`${generatedId}-minute`}
              value={minutes}
              onChange={handleMinuteChange}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-lg font-semibold text-[#0F172A] shadow-sm outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/40 disabled:cursor-not-allowed"
            >
              <option value="">Min.</option>

              {Array.from({ length: 12 }, (_, index) => {
                const minute = String(index * 5).padStart(2, '0')

                return (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-slate-500">
            Horários comuns
          </p>

          <div className="flex flex-wrap gap-2">
            {QUICK_TIMES.map((time) => {
              const isSelected = value === time

              return (
                <Button
                  key={time}
                  type="button"
                  size="sm"
                  variant={isSelected ? 'primary' : 'outline'}
                  onClick={() => handleQuickTime(time)}
                  disabled={disabled}
                >
                  {time}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {error ? (
        <p id={errorId} className="text-sm text-rose-600">
          {error}
        </p>
      ) : (
        <p className="text-sm text-slate-500">
          Escolha um horário ou use uma das opções rápidas.
        </p>
      )}
    </div>
  )
}

export default TimePicker