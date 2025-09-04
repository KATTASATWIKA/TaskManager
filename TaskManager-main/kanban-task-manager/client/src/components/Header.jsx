import { useAuthStore } from '../store/auth'
import { useTheme } from '../contexts/ThemeContext'
import { LogOut, User } from 'lucide-react'

function Header({ user }) {
  const { logout } = useAuthStore()
  const { isDarkMode } = useTheme()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header style={{
      padding: '16px 24px',
      borderBottom: `1px solid ${isDarkMode ? '#4b5563' : '#e2e8f0'}`,
      backgroundColor: isDarkMode ? '#111827' : 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#1e293b' }}>
        Task Manager
      </h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={20} color={isDarkMode ? '#d1d5db' : '#64748b'} />
          <span style={{ color: isDarkMode ? '#d1d5db' : '#64748b' }}>{user?.name}</span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header 