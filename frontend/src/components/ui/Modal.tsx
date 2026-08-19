import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  footer?: React.ReactNode
  className?: string
}

function join(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(' ')
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ open, title, children, onClose, footer, className, ...rest }, ref) => {

    useEffect(() => {
      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape' && open) {
          onClose()
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, onClose])

    useEffect(() => {
      if (open) {
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
          document.body.style.overflow = previousOverflow
        }
      }
    }, [open])

    if (!open) return null

    return (
      <div
        ref={ref}
        className={join(
          'fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm',
          className
        )}
        aria-modal="true"
        role="dialog"
        {...rest}
        onClick={onClose}
      >
        <div
          className="max-w-lg w-full rounded-3xl bg-white p-6 shadow-xl shadow-slate-900/10 transition duration-200 ease-out transform"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#1F2937]">{title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full select-none bg-slate-100 text-slate-700 transition duration-200 ease-in-out hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]/40"
              aria-label="Fechar modal"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 text-sm text-slate-700">{children}</div>

          {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'

export default Modal
