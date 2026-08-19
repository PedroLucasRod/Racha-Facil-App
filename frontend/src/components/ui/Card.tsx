import React from 'react'

type CardPadding = 'sm' | 'md' | 'lg'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  padding?: CardPadding
  hover?: boolean
  border?: boolean
  elevated?: boolean
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

function join(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(' ')
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      padding = 'md',
      hover = false,
      border = false,
      elevated = false,
      className,
      onClick,
      ...rest
    },
    ref
  ) => {
    const isClickable = Boolean(onClick)
    const classes = join(
        'rounded-2xl overflow-hidden bg-white shadow-sm transition duration-200 ease-in-out',
        paddingClasses[padding],
        border ? 'border border-slate-200' : '',
        elevated ? 'shadow-md' : '',
        hover ? 'hover:shadow-md hover:-translate-y-0.5' : '',
        isClickable
            ? 'cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]/40'
            : '',
        className
    )

    return (
      <div ref={ref} className={classes} onClick={onClick} {...rest}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
