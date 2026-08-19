import React from 'react'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  iconLeft?: React.ReactNode
  className?: string
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-sm',
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-[#DCFCE7] text-[#166534]',
  warning: 'bg-[#F59E0B] text-[#1F2937]',
  danger: 'bg-[#EF4444] text-white',
  info: 'bg-[#1F2937] text-white',
  neutral: 'bg-white text-[#1F2937] border border-slate-200',
}

function join(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(' ')
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'neutral',
      size = 'md',
      iconLeft,
      className,
      ...rest
    },
    ref
  ) => {
    const classes = join(
      'inline-flex items-center gap-2 rounded-full font-medium transition duration-200 ease-in-out',
      sizeClasses[size],
      variantClasses[variant],
      className
    )

    return (
      <span ref={ref} className={classes} {...rest}>
        {iconLeft ? <span className='inline-flex items-center'>{iconLeft}</span> : null}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
