import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, User, Menu } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Início', Icon: Home },
  { to: '/games', label: 'Jogos', Icon: CalendarDays },
  { to: '/profile', label: 'Perfil', Icon: User },
  { to: '/menu', label: 'Menu', Icon: Menu },
]

const BottomNavigation: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 h-[72px] shadow-[0_-1px_0_rgba(148,163,184,0.12)]">
      <div className="mx-auto flex h-full max-w-[980px]">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex w-full flex-col items-center justify-center gap-1 px-2 py-3 text-xs transition-all active:scale-95 ${
                isActive ? 'text-[#16A34A]' : 'text-slate-400'
              }`
            }
          >
            <Icon className="h-5 w-5"/>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNavigation
