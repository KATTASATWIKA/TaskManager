import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { boardsAPI } from '../api/client'
import { Plus, Folder, Calendar, Star, Clock, AlertTriangle, X, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { useTheme } from '../contexts/ThemeContext'

function Dashboard() {
  const { isDarkMode } = useTheme()
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('recent') // recent, name, created
  const [urgentTasks, setUrgentTasks] = useState([])
  const [showNotifications, setShowNotifications] = useState(true)

  useEffect(() => {
    loadBoards()
  }, [])

  // Refresh urgent tasks when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && boards.length > 0) {
        loadUrgentTasks(boards)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [boards])

  const loadBoards = async () => {
    try {
      const response = await boardsAPI.getAll()
      setBoards(response.data)
      
      // Fetch urgent and high priority tasks from all boards
      await loadUrgentTasks(response.data)
    } catch (error) {
      console.error('Error loading boards:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUrgentTasks = async (boardsData) => {
    try {
      const urgentTasksData = []
      
      for (const board of boardsData) {
        const boardResponse = await boardsAPI.getById(board._id)
        const { tasks, lists } = boardResponse.data
        
        // Find the "To Do" list
        const toDoList = lists.find(list => 
          list.title.toLowerCase().includes('to do') || 
          list.title.toLowerCase().includes('todo') ||
          list.title.toLowerCase().includes('pending')
        )
        
        if (toDoList) {
          // Filter urgent/high priority tasks only from "To Do" list
          const urgentTasksInBoard = tasks.filter(task => {
            const isUrgentOrHigh = task.priority === 'urgent' || task.priority === 'high'
            const isInToDoList = task.list === toDoList._id || task.listId === toDoList._id
            return isUrgentOrHigh && isInToDoList
          }).map(task => ({
            ...task,
            boardTitle: board.title,
            boardId: board._id,
            listTitle: toDoList.title
          }))
          
          urgentTasksData.push(...urgentTasksInBoard)
        }
      }
      
      setUrgentTasks(urgentTasksData)
    } catch (error) {
      console.error('Error loading urgent tasks:', error)
    }
  }

  const createBoard = async () => {
    const title = prompt('Enter board title:')
    if (!title) return

    try {
      const response = await boardsAPI.create(title)
      // Handle the new response format with board and lists
      if (response.data.board) {
        setBoards(prev => [...prev, response.data.board])
        // Refresh urgent tasks after creating a new board
        setTimeout(() => loadUrgentTasks([...boards, response.data.board]), 1000)
      } else {
        // Fallback for backward compatibility
        setBoards(prev => [...prev, response.data])
        setTimeout(() => loadUrgentTasks([...boards, response.data]), 1000)
      }
    } catch (error) {
      console.error('Error creating board:', error)
      alert('Failed to create board')
    }
  }

  const sortBoards = (boards) => {
    switch (sortBy) {
      case 'name':
        return [...boards].sort((a, b) => a.title.localeCompare(b.title))
      case 'created':
        return [...boards].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      case 'recent':
      default:
        return [...boards].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    }
  }

  const getSortIcon = () => {
    switch (sortBy) {
      case 'name': return '📝'
      case 'created': return '📅'
      case 'recent': return '🕒'
      default: return '🔄'
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div>Loading...</div>
      </div>
    )
  }

  const sortedBoards = sortBoards(boards)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: isDarkMode ? '#f9fafb' : '#1e293b', marginBottom: '8px' }}>
            Dashboard
          </h1>
          <p style={{ color: isDarkMode ? '#d1d5db' : '#64748b' }}>Manage your boards and tasks</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={createBoard} className="btn btn-primary">
            <Plus size={16} />
            New Board
          </button>
          <button 
            onClick={() => loadUrgentTasks(boards)} 
            style={{
              padding: '8px 16px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
          >
            <RefreshCw size={16} style={{ marginRight: '8px' }} />
            Refresh Urgent Tasks
          </button>
        </div>
      </div>

      {/* Urgent Tasks Notification Banner */}
      {showNotifications && urgentTasks.length > 0 && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          animation: 'slideInFromTop 0.6s ease-out, shake 2s ease-in-out 0.6s infinite',
          position: 'relative',
          boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.3)'
        }}>
          <button
            onClick={() => setShowNotifications(false)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#92400e',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={16} />
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={24} color="#92400e" />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#92400e',
                margin: 0,
                animation: 'pulse 1.5s ease-in-out infinite'
              }}>
                ⚠️ Urgent & High Priority Tasks in To Do
              </h3>
            </div>
            <button
              onClick={() => loadUrgentTasks(boards)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#92400e',
                padding: '4px',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              title="Refresh urgent tasks"
            >
              <RefreshCw size={16} />
            </button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {urgentTasks.map((task, index) => (
              <div
                key={`${task.boardId}-${task._id}`}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '16px',
                  border: `2px solid ${task.priority === 'urgent' ? '#dc2626' : '#f59e0b'}`,
                  animation: `slideInFromLeft 0.5s ease-out ${index * 0.1}s both, bounceIn 0.8s ease-out ${index * 0.1 + 0.5}s both`,
                  boxShadow: `0 4px 12px -2px ${task.priority === 'urgent' ? 'rgba(220, 38, 38, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    padding: '4px 8px',
                    backgroundColor: task.priority === 'urgent' ? '#fecaca' : '#fef3c7',
                    color: task.priority === 'urgent' ? '#dc2626' : '#92400e',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    animation: task.priority === 'urgent' ? 'pulse 1s ease-in-out infinite' : 'none'
                  }}>
                    {task.priority} Priority
                  </div>
                  <Link
                    to={`/board/${task.boardId}`}
                    style={{
                      fontSize: '12px',
                      color: '#8fdde7',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    📋 {task.boardTitle}
                  </Link>
                </div>
                
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: '0 0 8px 0',
                  lineHeight: '1.4'
                }}>
                  {task.title}
                </h4>
                
                {task.description && (
                  <p style={{
                    fontSize: '12px',
                    color: '#64748b',
                    margin: '0 0 8px 0',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {task.description}
                  </p>
                )}
                
                {task.dueDate && (
                  <div style={{
                    fontSize: '11px',
                    color: '#dc2626',
                    fontWeight: '500'
                  }}>
                    📅 Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Urgent Tasks Message */}
      {showNotifications && urgentTasks.length === 0 && (
        <div style={{
          backgroundColor: '#b6e5d8',
          border: '2px solid #9dd4c7',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          animation: 'slideInFromTop 0.6s ease-out',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#065f46',
              display: 'flex',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              ✓
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#065f46',
              margin: 0
            }}>
              All Good! No Urgent Tasks
            </h3>
          </div>
          <p style={{
            fontSize: '14px',
            color: '#065f46',
            margin: 0
          }}>
            You're all caught up with your high priority tasks. Great job! 🎉
          </p>
        </div>
      )}

      {/* Sort Controls */}
      {boards.length > 1 && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: isDarkMode ? '#1f2937' : 'white',
          borderRadius: '8px',
          border: `1px solid ${isDarkMode ? '#4b5563' : '#e2e8f0'}`
        }}>
          <span style={{ fontSize: '14px', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#374151' }}>
            Sort by:
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { key: 'recent', label: 'Recent', icon: '🕒' },
              { key: 'name', label: 'Name', icon: '📝' },
              { key: 'created', label: 'Created', icon: '📅' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setSortBy(option.key)}
                style={{
                  padding: '6px 12px',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#e2e8f0'}`,
                  backgroundColor: sortBy === option.key ? '#8fdde7' : (isDarkMode ? '#374151' : 'white'),
                  color: sortBy === option.key ? '#1e293b' : (isDarkMode ? '#f9fafb' : '#374151'),
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                {option.icon} {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {boards.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px 32px',
          backgroundColor: isDarkMode ? '#1f2937' : 'white',
          borderRadius: '12px',
          border: `2px dashed ${isDarkMode ? '#4b5563' : '#e2e8f0'}`
        }}>
          <Folder size={48} color={isDarkMode ? '#9ca3af' : '#94a3b8'} style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#374151', marginBottom: '8px' }}>
            No boards yet
          </h3>
          <p style={{ color: isDarkMode ? '#d1d5db' : '#64748b', marginBottom: '24px' }}>
            Create your first board to start organizing your tasks
          </p>
          <button onClick={createBoard} className="btn btn-primary">
            <Plus size={16} />
            Create Board
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
                     {sortedBoards.map((board, index) => (
             <Link
               key={board._id}
               to={`/board/${board._id}`}
               style={{
                 display: 'block',
                 padding: '24px',
                 backgroundColor: isDarkMode ? '#1f2937' : 'white',
                 borderRadius: '16px',
                 border: `1px solid ${isDarkMode ? '#4b5563' : '#e2e8f0'}`,
                 textDecoration: 'none',
                 color: 'inherit',
                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                 animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
                 transform: 'translateY(20px)',
                 opacity: 0
               }}
                               onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.15)'
                  e.currentTarget.style.borderColor = '#8fdde7'
                }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0) scale(1)'
                 e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                 e.currentTarget.style.borderColor = isDarkMode ? '#4b5563' : '#e2e8f0'
               }}
             >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                 <div style={{
                   padding: '8px',
                   backgroundColor: '#8fdde7',
                   borderRadius: '8px',
                   color: '#1e293b'
                 }}>
                  <Folder size={20} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#1e293b' }}>
                  {board.title}
                </h3>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: isDarkMode ? '#d1d5db' : '#64748b', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={16} />
                  {format(new Date(board.createdAt), 'MMM d, yyyy')}
                </div>
                {board.updatedAt && board.updatedAt !== board.createdAt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={16} />
                    Updated {format(new Date(board.updatedAt), 'MMM d')}
                  </div>
                )}
              </div>

              {board.listOrder && board.listOrder.length > 0 && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '8px 12px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  {board.listOrder.length} list{board.listOrder.length !== 1 ? 's' : ''}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard 