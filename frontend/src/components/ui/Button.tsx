import React from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'warning' | 'outline'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
	variant?: Variant
	size?: Size
	fullWidth?: boolean
	loading?: boolean
	iconLeft?: React.ReactNode
	iconRight?: React.ReactNode
	className?: string
}

const sizeClasses: Record<Size, string> = {
	sm: 'px-4 py-2 text-sm min-h-[48px]',
	md: 'px-5 py-3 text-sm min-h-[48px]',
	lg: 'px-6 py-3.5 text-base min-h-[48px]',
}

const variantClasses: Record<Variant, string> = {
	primary:
		'bg-[#16A34A] text-white hover:bg-[#15803d] active:bg-[#166534] disabled:bg-[#84c89a] disabled:text-white',
	secondary:
		'bg-[#1F2937] text-white hover:bg-[#111827] active:bg-[#111827] disabled:bg-slate-500 disabled:text-slate-300',
	danger:
		'bg-[#EF4444] text-white hover:bg-[#dc2626] active:bg-[#b91c1c] disabled:bg-[#fca5a5] disabled:text-white',
	warning:
		'bg-[#F59E0B] text-[#111827] hover:bg-[#d97706] active:bg-[#b45309] disabled:bg-[#fcd34d] disabled:text-[#111827]',
	outline:
		'bg-transparent border border-[#1F2937] text-[#1F2937] hover:bg-slate-100 active:bg-slate-200 disabled:border-slate-300 disabled:text-slate-400 disabled:bg-transparent',
}

const baseClasses =
	'inline-flex items-center justify-center gap-2 font-medium rounded-xl select-none transition duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#16A34A]/40'
const stateClasses = 'shadow-sm disabled:shadow-none'
const disabledClasses = 'opacity-60 cursor-not-allowed'
const loadingClasses = 'cursor-wait opacity-90'

function join(...parts: Array<string | false | undefined | null>) {
	return parts.filter(Boolean).join(' ')
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			children,
			variant = 'primary',
			size = 'md',
			fullWidth = false,
			loading = false,
			iconLeft,
			iconRight,
			className,
			disabled,
			type = 'button',
			...rest
		},
		ref
	) => {
		const isDisabled = disabled || loading
		const classes = join(
			baseClasses,
			sizeClasses[size],
			variantClasses[variant],
			stateClasses,
			fullWidth && 'w-full',
			isDisabled ? disabledClasses : '',
			loading ? loadingClasses : '',
			className
		)

		return (
			<button
				ref={ref}
				type={type}
				className={classes}
				disabled={isDisabled}
				aria-disabled={isDisabled}
				aria-busy={loading}
				{...rest}
			>
				<div className='inline-flex items-center gap-2'>
					{loading ? (
						<span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
					) : null}
					{iconLeft && !loading ? <span className='inline-flex items-center'>{iconLeft}</span> : null}
					<span className={loading ? 'opacity-80' : ''}>{children}</span>
					{iconRight && !loading ? <span className='inline-flex items-center'>{iconRight}</span> : null}
				</div>
			</button>
		)
	}
)

Button.displayName = 'Button'

export default Button

