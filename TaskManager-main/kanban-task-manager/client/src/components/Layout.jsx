import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useTheme } from '../contexts/ThemeContext'
import Sidebar from './Sidebar'
import Header from './Header'
import ThemeToggle from './ThemeToggle'

function Layout() {
  const { user } = useAuthStore()
  const { isDarkMode } = useTheme()

  return (
    <div 
      style={{ 
        display: 'flex', 
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
        color: isDarkMode ? '#f9fafb' : '#1f2937',
        transition: 'all 0.3s ease'
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header user={user} />
        <main style={{ flex: 1, padding: '24px' }}>
          <Outlet />
        </main>
      </div>
      {/* Theme Toggle - Fixed Position Bottom Right */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <ThemeToggle />
      </div>
    </div>
  )
}

export default Layout 