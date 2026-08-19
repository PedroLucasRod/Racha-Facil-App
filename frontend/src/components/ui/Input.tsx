import React, { useId, useState } from 'react'

type InputType = React.InputHTMLAttributes<HTMLInputElement>['type']

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helpText?: string
  error?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  password?: boolean
  className?: string
}

function join(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(' ')
}

const baseClasses =
  'w-full rounded-xl min-h-[48px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition duration-200 ease-in-out focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/40 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed'
const errorClasses = 'border-rose-500 text-slate-900 focus:border-rose-500 focus:ring-rose-500/40'

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helpText,
      error,
      iconLeft,
      iconRight,
      password = false,
      className,
      id,
      disabled,
      required,
      type = 'text',
      ...rest
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const [showPassword, setShowPassword] = useState(false)
    const inputType = password ? (showPassword ? 'text' : 'password') : type
    const hasLeftIcon = Boolean(iconLeft)
    const hasRightIcon = Boolean(iconRight) || password
    const describedBy = join(
      error ? `${inputId}-error` : '',
      helpText ? `${inputId}-helptext` : ''
    )

    const inputClasses = join(
      baseClasses,
      error ? errorClasses : '',
      hasLeftIcon ? 'pl-12' : '',
      hasRightIcon ? 'pr-12' : '',
      className
    )

    return (
      <div className={join('space-y-3', disabled ? 'opacity-80' : '')}>
        {label ? (
          <label htmlFor={inputId} className='block text-sm font-medium text-[#1F2937]'>
            {label}
            {required ? <span className='ml-1 text-[#EF4444]'>*</span> : null}
          </label>
        ) : null}

        <div className='relative'>
          {iconLeft ? (
            <span className='pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400'>
              {iconLeft}
            </span>
          ) : null}

          <input
            ref={ref}
            id={inputId}
            type={inputType as InputType}
            className={inputClasses}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy || undefined}
            {...rest}
          />

          {iconRight && !password ? (
            <span className='pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400'>
              {iconRight}
            </span>
          ) : null}

          {password ? (
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={disabled}
              className='absolute inset-y-0 right-4 inline-flex items-center rounded-xl px-3 text-sm font-medium text-slate-500 transition duration-200 ease-in-out hover:text-slate-900 focus-visible:outline-none focus-visible:border-[#16A34A] focus-visible:ring-2 focus-visible:ring-[#16A34A]/40 disabled:cursor-not-allowed disabled:text-slate-400'
            >
              {showPassword ? '👁️‍🗨️' : '👁'}
            </button>
          ) : null}
        </div>

        {error ? (
          <p id={`${inputId}-error`} className='text-sm '>
            {error}
          </p>
        ) : helpText ? (
          <p id={`${inputId}-helptext`} className='text-sm text-slate-500'>
            {helpText}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
