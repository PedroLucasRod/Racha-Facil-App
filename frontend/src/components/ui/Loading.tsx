import React from 'react'

type LoadingVariant = 'spinner' | 'dots'
type LoadingSize = 'sm' | 'md' | 'lg'

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: LoadingVariant
  size?: LoadingSize
  label?: string
  fullScreen?: boolean
  className?: string
}

const join = (...parts: Array<string | false | undefined | null>) =>
  parts.filter(Boolean).join(' ')

const sizeClasses: Record<LoadingSize, { spinner: string; dot: string; label: string }> = {
  sm: { spinner: 'w-4 h-4 border-2', dot: 'w-2 h-2', label: 'text-xs' },
  md: { spinner: 'w-6 h-6 border-[2.5px]', dot: 'w-2.5 h-2.5', label: 'text-sm' },
  lg: { spinner: 'w-8 h-8 border-[3px]', dot: 'w-3 h-3', label: 'text-base' },
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      variant = 'spinner',
      size = 'md',
      label,
      fullScreen = false,
      className,
      ...rest
    },
    ref
  ) => {
    const sizes = sizeClasses[size]

    const wrapperClasses = join(
      'flex items-center justify-center',
      fullScreen &&
         'fixed inset-0 z-50 bg-black/20 backdrop-blur-sm',
      className
    )

    const containerClasses = join(
      'flex items-center justify-center gap-3 rounded-3xl bg-white/95 p-5 shadow-xl text-[#1F2937] transition-all duration-200 ease-in-out select-none',
      'backdrop-blur-sm',
      !fullScreen ? 'inline-flex' : 'w-[min(92%,440px)]'
    )

    const spinnerClasses = join(
      'inline-flex items-center justify-center rounded-full border-solid animate-spin transition-all duration-200 ease-in-out',
      sizes.spinner,
      'border-[#16A34A] border-t-transparent'
    )

    const dotClasses = join(
      'inline-flex items-center justify-center rounded-full bg-[#16A34A] animate-bounce transition-all duration-200 ease-in-out',
      sizes.dot
    )

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={wrapperClasses}
        {...rest}
      >
        <div className={containerClasses}>
          <div className="flex items-center justify-center gap-3">
            {variant === 'spinner' ? (
              <span className={spinnerClasses} />
            ) : (
              <span className="inline-flex items-center justify-center gap-2">
                <span className={join(dotClasses, 'delay-75')} />
                <span className={join(dotClasses, 'delay-150')} />
                <span className={join(dotClasses, 'delay-200')} />
              </span>
            )}

            {label ? <span className={join('font-medium text-[#1F2937]', sizes.label)}>{label}</span> : null}
          </div>
        </div>
      </div>
    )
  }
)

Loading.displayName = 'Loading'

export default Loading
