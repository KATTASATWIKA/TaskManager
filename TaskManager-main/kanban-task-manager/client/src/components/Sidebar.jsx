import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useTheme } from '../contexts/ThemeContext'
import { boardsAPI } from '../api/client'
import { useEffect, useState } from 'react'
import { Plus, LayoutDashboard, Folder } from 'lucide-react'
import CreateBoardModal from './CreateBoardModal'

function Sidebar() {
  const location = useLocation()
  const { user } = useAuthStore()
  const { isDarkMode } = useTheme()
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateBoard, setShowCreateBoard] = useState(false)

  useEffect(() => {
    if (user) {
      loadBoards()
    }
  }, [user])

  const loadBoards = async () => {
    try {
      const response = await boardsAPI.getAll()
      setBoards(response.data)
    } catch (error) {
      console.error('Error loading boards:', error)
    } finally {
      setLoading(false)
    }
  }

  const createBoard = async ({ title }) => {
    try {
      const response = await boardsAPI.create(title)
      // Handle the new response format with board and lists
      if (response.data.board) {
        setBoards(prev => [...prev, response.data.board])
      } else {
        // Fallback for backward compatibility
        setBoards(prev => [...prev, response.data])
      }
      setShowCreateBoard(false)
    } catch (error) {
      console.error('Error creating board:', error)
      alert('Failed to create board')
    }
  }

  return (
    <>
    <aside style={{
      width: '280px',
      backgroundColor: isDarkMode ? '#111827' : 'white',
      borderRight: `1px solid ${isDarkMode ? '#4b5563' : '#e2e8f0'}`,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      transition: 'all 0.3s ease'
    }}>
      <div>
        <Link 
          to="/dashboard" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '8px',
            textDecoration: 'none',
            color: location.pathname === '/dashboard' ? (isDarkMode ? '#f9fafb' : '#3b82f6') : (isDarkMode ? '#d1d5db' : '#64748b'),
            backgroundColor: location.pathname === '/dashboard' ? (isDarkMode ? '#374151' : '#eff6ff') : 'transparent',
            fontWeight: location.pathname === '/dashboard' ? '500' : '400'
          }}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
      </div>

      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#374151' }}>
            Boards
          </h3>
          <button 
            onClick={() => setShowCreateBoard(true)}
            style={{
              padding: '4px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#64748b',
              borderRadius: '4px'
            }}
            title="Create new board"
          >
            <Plus size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#64748b', fontSize: '14px' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {boards.map(board => (
              <Link
                key={board._id}
                to={`/dashboard/board/${board._id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: location.pathname === `/dashboard/board/${board._id}` ? (isDarkMode ? '#f9fafb' : '#3b82f6') : (isDarkMode ? '#d1d5db' : '#64748b'),
                  backgroundColor: location.pathname === `/dashboard/board/${board._id}` ? (isDarkMode ? '#374151' : '#eff6ff') : 'transparent',
                  fontSize: '14px',
                  fontWeight: location.pathname === `/dashboard/board/${board._id}` ? '500' : '400'
                }}
              >
                <Folder size={16} />
                {board.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
    <CreateBoardModal 
      open={showCreateBoard} 
      onClose={() => setShowCreateBoard(false)} 
      onCreate={createBoard}
      isDarkMode={isDarkMode}
    />
    </>
  )
}

export default Sidebar 