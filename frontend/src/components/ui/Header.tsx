import React from 'react'
import { ArrowLeft } from 'lucide-react'

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string
  subtitle?: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: React.ReactNode
  className?: string
}

const join = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

const Header = React.forwardRef<HTMLElement, HeaderProps>(function Header(
  { title, subtitle, showBack = false, onBack, rightAction, className, ...rest },
  ref,
) {
  return (
    <header
      ref={ref}
      {...rest}
      className={join(
        'flex items-center justify-between px-4 py-3 bg-transparent',
        'gap-4',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar"
            className={join(
              'inline-flex items-center justify-center rounded-md p-2',
              'bg-[#F8FAFC] text-[#1F2937] hover:bg-opacity-95', 'select-none',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2',
              'transition-all duration-200 active:opacity-90 active:scale-[0.98]'
            )}
          >
            <ArrowLeft size={16} />
          </button>
        ) : null}

        <div className="flex flex-col leading-tight">
          <h1 className="m-0 text-lg font-semibold text-[#1F2937] font-inter">{title}</h1>
          {subtitle ? (
            <p className="m-0 text-sm text-[#1F2937] opacity-70">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">{rightAction}</div>
    </header>
  )
})

export default Header
