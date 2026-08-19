import React from 'react'
import PageContainer from '../components/ui/PageContainer'
import Header from '../components/ui/Header'
import BottomNavigation from '../components/ui/BottomNavigation'

type MainLayoutProps = {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <PageContainer className="bg-[#F8FAFC] pb-24">
      <div className="flex min-h-screen flex-col">
        <Header title="Racha Fácil" />
        <main className="flex-1 p-4">{children}</main>
      </div>
      <BottomNavigation />
    </PageContainer>
  )
}

export default MainLayout
