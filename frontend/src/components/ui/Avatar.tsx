import React from 'react'

type Size = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  name?: string
  size?: Size
  online?: boolean
  className?: string
}

const join = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

const sizeClasses: Record<Size, { container: string; text: string; indicator: string }> = {
  sm: { container: 'w-8 h-8 text-sm', text: 'text-sm', indicator: 'w-2.5 h-2.5' },
  md: { container: 'w-10 h-10 text-base', text: 'text-base', indicator: 'w-3 h-3' },
  lg: { container: 'w-12 h-12 text-lg', text: 'text-lg', indicator: 'w-3.5 h-3.5' },
  xl: { container: 'w-16 h-16 text-2xl', text: 'text-2xl', indicator: 'w-4 h-4' },
}

const PALETTE = ['#16A34A', '#1F2937', '#0EA5A4', '#7C3AED', '#F59E0B']

function pickColor(key?: string) {
  if (!key) return PALETTE[1]
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash << 5) - hash + key.charCodeAt(i)
  const idx = Math.abs(hash) % PALETTE.length
  return PALETTE[idx]
}

function initialsFromName(name?: string) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M12 12a4 4 0 100-8 4 4 0 000 8zM21 21a8 8 0 10-18 0"
      stroke="#F8FAFC"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { src, name, size = 'md', online = false, className, ...rest },
  ref,
) {
  const sizes = sizeClasses[size]
  const initials = initialsFromName(name)
  const bgColor = pickColor(name)

  return (
    <div
      ref={ref}
      role="img"
      aria-label={name || (src ? 'Avatar' : 'User')}
      className={join(
        'relative inline-flex items-center justify-center select-none rounded-full overflow-hidden transition duration-200 ease-in-out',
        sizes.container,
        className,
      )}
      {...rest}
    >
      {src ? (
        // image avatar
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          src={src}
          alt={name || 'Avatar'}
          className={join('w-full h-full object-cover', 'block')}
          loading="lazy"
        />
      ) : name ? (
        // initials avatar
        <span
          className={join('flex items-center justify-center w-full h-full font-medium tracking-wide uppercase', sizes.text, 'text-[#F8FAFC]')}
          style={{ backgroundColor: bgColor }}
        >
          {initials}
        </span>
      ) : (
        // fallback icon
        <span className={join('flex items-center justify-center w-full h-full', sizes.text)} style={{ backgroundColor: '#1F2937' }}>
          <UserIcon className={join('w-1/2 h-1/2')} />
        </span>
      )}

      {online && (
        <span
          aria-hidden="true"
          className={join(
            'absolute rounded-full ring-2 transition-transform',
            sizes.indicator,
            'bg-[#16A34A] ring-[#F8FAFC]'
          )}
          style={{ right: '0.08rem', bottom: '0.08rem' }}
        />
      )}
    </div>
  )
})

export default Avatar
