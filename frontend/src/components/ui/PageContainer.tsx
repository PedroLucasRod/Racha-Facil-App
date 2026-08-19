import React from 'react'

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  centerContent?: boolean
  className?: string
}

function join(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(' ')
}

const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ children, centerContent = false, className, ...rest }, ref) => {
    const classes = join(
      'min-h-screen px-4 py-6 sm:px-6 lg:px-8 transition-all duration-200',
      centerContent && 'flex items-center justify-center',
      className
    )

    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    )
  }
)

PageContainer.displayName = 'PageContainer'

export default PageContainer
