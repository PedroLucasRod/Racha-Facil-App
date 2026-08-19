import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import PageContainer from '../../components/ui/PageContainer'
import Loading from '../../components/ui/Loading'

const SplashPage: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login')
    }, 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [navigate])

  return (
    <PageContainer
      className="bg-[#16A34A] text-white"
      centerContent
    >
      <div className="flex w-full max-w-lg flex-col items-center justify-center gap-6 text-center px-4 py-16">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/15 text-[#F8FAFC] shadow-lg shadow-black/10">
          <Trophy className="h-12 w-12" />
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl font-semibold tracking-tight">Racha Fácil</h1>
          <p className="text-base text-white/80">Organize seu futebol de forma simples</p>
        </div>

        <Loading variant="dots" size="lg" label="Carregando..." />
      </div>
    </PageContainer>
  )
}

export default SplashPage
